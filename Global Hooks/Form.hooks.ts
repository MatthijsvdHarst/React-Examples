import {
  JsonFormsRendererRegistryEntry,
  JsonSchema7,
  UISchemaElement,
} from '@jsonforms/core';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonFormsInitStateProps, JsonFormsReactProps } from '@jsonforms/react';
import { useEffect, useMemo, useState } from 'react';
import { RECORD_STATUS } from './Record.hooks';
import { ErrorObject } from 'ajv';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

interface IProps<P, T> {
  recordStatus: RECORD_STATUS;
  isNewRecord: boolean;
  record?: T | P;
  data: Partial<P>;
  setData: React.Dispatch<React.SetStateAction<Partial<P>>>;
  schema: JsonSchema7;
  uischema?: UISchemaElement;
  projectRenderers?: JsonFormsRendererRegistryEntry[];
  extraRenderers?: JsonFormsRendererRegistryEntry[];
}

export enum FORM_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

dayjs.locale('en');

export function useForm<RecordType, T>(props: IProps<RecordType, T>) {
  const {
    schema,
    uischema,
    recordStatus,
    isNewRecord,
    record,
    data,
    setData,
    projectRenderers,
    extraRenderers,
  } = props;
  const [formErrors, setFormErrors] = useState<Array<ErrorObject>>();

  const renderers = useMemo(() => {
    if (!extraRenderers) {
      return [...materialRenderers];
    }
    if (!projectRenderers) {
      return [...extraRenderers, ...materialRenderers];
    }
    return [...extraRenderers, ...materialRenderers, ...projectRenderers];
  }, [extraRenderers, projectRenderers]);

  useEffect(() => {
    if (recordStatus !== RECORD_STATUS.SUCCEEDED) {
      return;
    }

    if (isNewRecord) {
      return;
    }

    if (!record) {
      return;
    }

    setData(record as RecordType);
  }, [setData, isNewRecord, record, recordStatus]);

  const jsonformProps: JsonFormsInitStateProps & JsonFormsReactProps = {
    schema,
    uischema,
    renderers,
    cells: materialCells,
    data,
    onChange: ({ data: updatedData, errors }) => {
      setData(updatedData);
      setFormErrors(errors);
    },
    validationMode: 'ValidateAndShow',
  };

  const formStatus: FORM_STATUS = useMemo(() => {
    switch (recordStatus) {
      case RECORD_STATUS.IDLE:
        return FORM_STATUS.IDLE;
      case RECORD_STATUS.LOADING:
        return FORM_STATUS.LOADING;
      case RECORD_STATUS.SUCCEEDED:
        return FORM_STATUS.SUCCEEDED;
      case RECORD_STATUS.FAILED:
        return FORM_STATUS.FAILED;
      default:
        return null as never;
    }
  }, [recordStatus]);

  return {
    data,
    jsonformProps,
    formStatus,
    formErrors,
    hasFormErrors: formErrors?.length !== 0,
  };
}
