import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { schema } from '../views';
import { JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { JsonSchema7 } from '@jsonforms/core';
import {
  ALL_RECORDS_STATUS,
  mapListResult,
  useSetSchema,
} from '@tes/utils-hooks';
import {
  ICalibration,
  ICalibrationModel,
  useGetAllCalibrationDevicesQuery,
} from '@tes/calibration';
import {
  IEquipment,
  IEquipmentModel,
  useGetAllEquipmentQuery,
} from '@tes/equipment';
import {
  ISample,
  ISampleListItemPayload,
  useGetAllTwaCalculationsQuery,
} from '../api';
import isEqual from 'lodash.isequal';
import get from 'lodash.get';
import set from 'lodash.set';

interface IProps {
  baseJsonformProps: JsonFormsInitStateProps & JsonFormsReactProps;
  setData: Dispatch<SetStateAction<Partial<ISampleListItemPayload>>>;
  data?: Partial<ISampleListItemPayload>;
  record?: ISample;
}

export enum DYNAMIC_FORM_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useDynamicFormElements(props: IProps) {
  const { baseJsonformProps, setData, record } = props;
  const [schemaState, setSchemaState] = useState<JsonSchema7>(schema);
  const [dynamicFormStatus, setDynamicFormStatus] =
    useState<DYNAMIC_FORM_STATUS>(DYNAMIC_FORM_STATUS.IDLE);

  const responseEquipment = useGetAllEquipmentQuery({
    page: 0,
    limit: 99999,
    search: '',
  });

  const responseCalDevices = useGetAllCalibrationDevicesQuery({
    page: 0,
    limit: 99999,
    search: '',
  });

  const { itemList } = mapListResult(responseEquipment.data);
  const { itemList: calItemList } = mapListResult(responseCalDevices.data);

  const formattedEquipment = itemList
    .map((item) => ({
      ...item,
      equipmentSet: item.equipmentSet.map((subitem) => ({
        ...subitem,
        parent: item,
      })),
    }))
    .reduce((acc: Array<IEquipment & { parent: IEquipmentModel }>, item) => {
      return [...acc, ...item.equipmentSet];
    }, [])
    .map((item) => ({
      const: `${item.id} | ${item.parent.equipmentType}`,
      title: `${item.parent.title}, #${item.serialNumber}`,
    }));

  const formattedCalDevices = calItemList
    .map((item) => ({
      ...item,
      calibrationDeviceSet: item.calibrationDeviceSet.map((subitem) => ({
        ...subitem,
        parent: item,
      })),
    }))
    .reduce(
      (acc: Array<ICalibration & { parent: ICalibrationModel }>, item) => {
        return [...acc, ...item.calibrationDeviceSet];
      },
      [],
    )
    .map((item) => ({
      const: item.id,
      title: `${item.parent.title}, #${item.serialNumber}`,
    }));

  useEffect(() => {
    if (dynamicFormStatus === DYNAMIC_FORM_STATUS.SUCCEEDED) {
      return;
    }

    setDynamicFormStatus(DYNAMIC_FORM_STATUS.SUCCEEDED);
  }, [dynamicFormStatus]);

  useEffect(() => {
    const equipmentSchemaPath = 'properties/equipment/oneOf'.split('/');
    const calSchemaPath = 'properties/calibratedWith/oneOf'.split('/');

    if (!responseEquipment.isSuccess) {
      return;
    }

    if (!responseCalDevices.isSuccess) {
      return;
    }

    if (!itemList) {
      return;
    }

    if (!calItemList) {
      return;
    }

    if (!formattedEquipment) {
      return;
    }

    if (!isEqual(formattedEquipment, get(schemaState, equipmentSchemaPath))) {
      setSchemaState((prevState) => ({
        ...set(prevState, equipmentSchemaPath, formattedEquipment),
      }));
    }
    if (!isEqual(formattedCalDevices, get(schemaState, calSchemaPath))) {
      setSchemaState((prevState) => ({
        ...set(prevState, calSchemaPath, formattedCalDevices),
      }));
    }
    setDynamicFormStatus(DYNAMIC_FORM_STATUS.SUCCEEDED);
  }, [
    calItemList,
    formattedCalDevices,
    formattedEquipment,
    itemList,
    responseCalDevices.isSuccess,
    responseEquipment.isSuccess,
    schemaState,
  ]);

  const { allRecordsStatus: twaCalcultation } = useSetSchema({
    schemaPath: 'properties/twaCalculationMethod/oneOf',
    setSchemaState,
    useGetAllRecordsQuery: useGetAllTwaCalculationsQuery,
  });

  useEffect(() => {
    setData((prevState) => {
      if (!record) {
        return {
          ...prevState,
        };
      }
      if (!record.initialFlowRate) {
        return {
          ...prevState,
        };
      }

      return {
        ...prevState,
        equipment:
          `${record.equipment.id} | ${record.equipment.model.equipmentType}` ||
          '',
        calibratedWith: record.calibratedWith ? record.calibratedWith.id : '',
        initialFlowRate: record.initialFlowRate,
      };
    });
  }, [record, setData]);

  const jsonformProps = useMemo(() => {
    if (dynamicFormStatus !== DYNAMIC_FORM_STATUS.SUCCEEDED) {
      return;
    }

    if (twaCalcultation !== ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }

    return {
      ...baseJsonformProps,
      schema: schemaState,
    };
  }, [baseJsonformProps, dynamicFormStatus, schemaState, twaCalcultation]);

  return {
    jsonformProps,
    dynamicFormStatus,
  };
}
