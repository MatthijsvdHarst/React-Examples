import {
  mapListResult,
  DjangoRestFrameworkResult,
} from '../djangorestframework';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { JsonSchema7 } from '@jsonforms/core';
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { QueryDefinition } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import { updateOneOfValidator } from '../jsonschema';

interface IProps<
  TagTypes extends string,
  ResultType,
  ReducerPath extends string,
> {
  schemaPath: string;
  setSchemaState: Dispatch<SetStateAction<JsonSchema7>>;
  useGetAllRecordsQuery: UseQuery<
    QueryDefinition<
      // eslint-disable-next-line @typescript-eslint/ban-types
      {},
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      TagTypes,
      DjangoRestFrameworkResult<ResultType>,
      ReducerPath
    >
  >;
}

export enum ALL_RECORDS_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useSetSchema<
  TagTypes extends string,
  ResultType,
  ReducerPath extends string,
>(props: IProps<TagTypes, ResultType, ReducerPath>) {
  const { setSchemaState, schemaPath, useGetAllRecordsQuery } = props;
  const [allRecordsStatus, setAllRecordsStatus] = useState<ALL_RECORDS_STATUS>(
    ALL_RECORDS_STATUS.IDLE,
  );

  const splitPath = schemaPath.split('/');

  const {
    data: resultData,
    isLoading,
    isError,
    error,
  } = useGetAllRecordsQuery({});

  useEffect(() => {
    if (allRecordsStatus === ALL_RECORDS_STATUS.LOADING) {
      return;
    }

    if (isLoading) {
      setAllRecordsStatus(ALL_RECORDS_STATUS.LOADING);
    }
  }, [allRecordsStatus, isLoading]);

  useEffect(() => {
    if (allRecordsStatus === ALL_RECORDS_STATUS.FAILED) {
      return;
    }

    if (isError) {
      setAllRecordsStatus(ALL_RECORDS_STATUS.FAILED);
    }
  }, [allRecordsStatus, isError]);

  useEffect(() => {
    if (!resultData) {
      return;
    }

    if (allRecordsStatus === ALL_RECORDS_STATUS.SUCCEEDED) {
      return;
    }

    const { itemList } = mapListResult(resultData);

    const formattedResultData = (
      itemList as Array<ResultType & { id: string; title: string }>
    ).map((item) => ({
      const: item.id,
      title: item.title,
    }));

    updateOneOfValidator(formattedResultData, setSchemaState, splitPath);

    setAllRecordsStatus(ALL_RECORDS_STATUS.SUCCEEDED);
  }, [resultData, allRecordsStatus, setSchemaState, splitPath]);

  const isRecordNotFound = useMemo(
    () => isError && (error as FetchBaseQueryError)?.status === 404,
    [isError, error],
  );

  return {
    allRecordsStatus,
    isRecordNotFound,
  };
}
