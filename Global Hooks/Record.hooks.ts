import { QueryDefinition } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

// "Products", IProduct, "productsApi"
interface IProps<
  TagTypes extends string,
  ResultType,
  ReducerPath extends string,
> {
  givenId?: string;
  refetchOnMount?: boolean;
  useRecordQuery: UseQuery<
    QueryDefinition<
      string,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        // eslint-disable-next-line @typescript-eslint/ban-types
        {},
        FetchBaseQueryMeta
      >,
      TagTypes,
      ResultType,
      ReducerPath
    >
  >;
}

type IParams = {
  id?: string;
};

export enum RECORD_STATUS {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCEEDED = 'success',
  FAILED = 'failed',
}

export function useRecord<
  TagTypes extends string,
  ResultType,
  ReducerPath extends string,
>(props: IProps<TagTypes, ResultType, ReducerPath>) {
  const { useRecordQuery, givenId, refetchOnMount = false } = props;

  /**
   * Select Record ID (from navigation)
   */
  const { id } = useParams<IParams>();
  /**
   * Select Record by given ID of ID from navigation
   */
  const recordId = givenId || id;

  const isNewRecord = !recordId;

  /**
   * Select Record (from Server) or use new Record
   */
  const {
    data: record,
    isLoading,
    isError,
    error,
    refetch,
  } = useRecordQuery(!isNewRecord ? recordId : '', {
    skip: isNewRecord,
    refetchOnMountOrArgChange: refetchOnMount,
  });

  const [recordStatus, setRecordStatus] = useState<RECORD_STATUS>(
    RECORD_STATUS.IDLE,
  );

  // If new record, status is Succeeded right away
  useEffect(() => {
    if (recordStatus === RECORD_STATUS.SUCCEEDED) {
      return;
    }

    if (!isNewRecord) {
      return;
    }

    setRecordStatus(RECORD_STATUS.SUCCEEDED);
  }, [isNewRecord, recordStatus]);

  // Once started loading, change status to loading
  useEffect(() => {
    if (recordStatus === RECORD_STATUS.LOADING) {
      return;
    }

    if (!isLoading) {
      return;
    }

    setRecordStatus(RECORD_STATUS.LOADING);
  }, [isLoading, recordStatus]);

  useEffect(() => {
    if (recordStatus === RECORD_STATUS.FAILED) {
      return;
    }

    if (!isError) {
      return;
    }

    setRecordStatus(RECORD_STATUS.FAILED);
  }, [isError, recordStatus]);

  useEffect(() => {
    if (recordStatus === RECORD_STATUS.SUCCEEDED) {
      return;
    }

    if (!record) {
      return;
    }

    setRecordStatus(RECORD_STATUS.SUCCEEDED);
  }, [record, recordStatus]);

  const isRecordNotFound = useMemo(
    () => isError && (error as FetchBaseQueryError)?.status === 404,
    [isError, error],
  );

  return {
    isNewRecord,
    record,
    recordStatus,
    error,
    isRecordNotFound,
    recordId,
    refetch,
  };
}
