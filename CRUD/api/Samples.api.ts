import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';
import { OrderDirection } from '@tes/client';

export interface ISampleListItem {
  id: string;
  sampleId: string;
  surveyMoment: {
    project: string;
    startDate: string;
  };
  sampleType: string;
  sampler: string;
  equipment: {
    id: string;
    serialNumber: string;
    model: string;
  };
  calibratedWith: string | null;
  personSampleSubject: string;
  areaSampleSubject: string;
  constituents: Array<{ id: string; title: string }>;
  startTime: string;
  checkins: Array<ILastChecked>;
  twaCalculationMethod: string;
}

interface ISamplePayload {
  page: number;
  limit: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
  filterParams: { [key: string]: string };
}

export interface ISampleListItemPayload {
  id: string;
  sampleId: string;
  surveyMoment: {
    project: string;
    startDate: string;
  };
  sampleType: string;
  sampler: string;
  equipment: string;
  calibratedWith: string | null;
  personSampleSubject: string;
  areaSampleSubject: string;
  constituents: Array<{ id: string; title: string }>;
  startTime: string;
  checkins: Array<ILastChecked>;
  twaCalculationMethod: string;
  endTime: string;
  finalFlowRate: string;
}

export interface ISample {
  id: string;
  surveyMoment: {
    id: string;
    startDate: string;
    project: string;
  };
  equipment: {
    id: string;
    serialNumber: string;
    model: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      equipmentType: 'noise' | 'chemical';
    };
  };
  calibratedWith: {
    id: string;
    model: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
    };
    serialNumber: string;
  };
  personSampleSubject: null | string;
  areaSampleSubject: null | string;
  sampleId: string;
  sampleType: string;
  sampler: string;
  startTime: string;
  averageFlowRate: string;
  durationInMinutes: string;
  type: string;
  endTime: string;
  constituents: Array<{ title: string; id: string }>;
  initialFlowRate: string;
  finalFlowRate: string;
  twaCalculationMethod: {
    id: string;
    title: string;
  };
  checkins: Array<ILastChecked>;
}
export interface ISampleExtended {
  id: string;
  surveyMoment: {
    id: string;
    startDate: string;
    project: string;
  };
  equipment: {
    id: string;
    serialNumber: string;
    model: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      equipmentType: 'noise' | 'chemical';
    };
  };
  calibratedWith: {
    id: string;
    model: {
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
    };
    serialNumber: string;
  };
  personSampleSubject: null | {
    id: string;
  };
  areaSampleSubject: null | {
    id: string;
  };
  sampleId: string;
  sampleType: string;
  sampler: string;
  startTime: string;
  endTime: string;
  constituents: Array<{ title: string; id: string }>;
  initialFlowRate: string;
  finalFlowRate: string;
  averageFlowRate: string;
  durationInMinutes: string;
  type: string;
  twaCalculationMethod: {
    id: string;
    title: string;
  };
  checkins: Array<ILastChecked>;
}

export interface ILastChecked {
  id: string;
  createdAt: string;
  sample: string;
}

export interface IResultsPayload {
  sample?: string;
  sampleType: string;
  twaCalculationMethod?: string;
  constituent?: string;
  acgihNoishDba?: string;
  acgihNoishDose?: string;
  oshaHcpDba?: string;
  oshaHcpDose?: string;
  oshaPelDba?: string;
  oshaPelDose?: string;
  lasMaxDba?: string;
}

export interface ISampleResultListItem {
  constituent: string;
  id: string;
  lodSr2: string;
  method: string;
  oel: string;
  reportLimit: string;
  sample: string;
  total: string;
  twaCalculationMethod: string;
  twaResult: string;
  sampleResult: string;
  unit: string;
  volume: string;
}

interface ISampleUpdatePayload {
  id: string;
  surveyMoment: {
    startDate: string;
    project: string;
  };
  constituents: Array<{ title: string; id: string }>;
  sampleId: string;
  sampler: string;
  initialFlowRate: string;
  finalFlowRate: string;
  startTime: string;
  endTime: string;
  equipment: string;
  calibratedWith: string;
  personSampleSubject: string;
  areaSampleSubject: string;
  twaCalculationMethod: string;
}

export interface ISampleResultNoiseListItem {
  id: string;
  oel: string;
  lodSr2: string;
  sample: string;
  unit: {
    id: string;
    title: string;
  };
  constituent: {
    id: string;
    title: string;
  };
  al: number;
  acgihNoishDba: string;
  acgihNoishDose: string;
  oshaHcpDba: string;
  oshaHcpDose: string;
  oshaPelDba: string;
  oshaPelDose: string;
  lasMaxDba: string;
}

export const SampleApi = createApi({
  reducerPath: 'SampleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { extra }) => {
      headers.set('Authorization', `Bearer ${extra}`);
      return headers;
    },
  }),
  tagTypes: ['Sample'],
  endpoints: (builder) => ({
    getAllSamples: builder.query<
      DjangoRestFrameworkResult<ISampleListItem>,
      Partial<ISamplePayload>
    >({
      query: (params) => {
        const {
          page = 0,
          limit = 10,
          orderBy = '',
          orderDirection = OrderDirection.ASC,
          search,
          filterParams = {},
        } = params || {};

        let ordering = '';
        if (orderBy !== '') {
          ordering = orderBy;

          if (orderDirection === OrderDirection.DESC) {
            ordering = `-${ordering}`;
          }
        }

        return {
          url: `samples/`,
          params: {
            ...filterParams,
            search,
            page_size: limit,
            ordering,
            offset: page * limit,
          },
        };
      },
    }),
    getAllSamplesBySurveyMoment: builder.query<
      DjangoRestFrameworkResult<ISampleListItem>,
      {
        surveyMomentId: {
          project: string;
          startDate: string;
        };
      }
    >({
      query: ({ surveyMomentId }) => {
        return {
          url: `samples/`,
          params: {
            survey_moment__start_date: surveyMomentId.startDate,
            survey_moment__project: surveyMomentId.project,
          },
        };
      },
      providesTags: (result) =>
        result && result.results
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Sample' as const,
                id: id,
              })),
            ]
          : [{ type: 'Sample', id: 'LIST' }],
    }),
    getSampleById: builder.query<ISample, string>({
      query: (uuid) => `samples/${uuid}`,
      transformResponse: (response: ISampleExtended) => {
        return {
          ...response,
          surveyMoment: {
            id: response.surveyMoment.id,
            project: response.surveyMoment.project,
            startDate: response.surveyMoment.startDate,
          },
          areaSampleSubject: response.areaSampleSubject
            ? response.areaSampleSubject.id
            : null,
          personSampleSubject: response.personSampleSubject
            ? response.personSampleSubject.id
            : null,
        };
      },
      providesTags: (arg) => [{ type: 'Sample', id: arg?.id }],
    }),
    createSample: builder.mutation<ISampleListItem, ISampleListItemPayload>({
      query: (body) => {
        return {
          url: 'samples/',
          method: 'POST',
          body: body,
        };
      },
      invalidatesTags: [{ type: 'Sample', id: 'LIST' }],
    }),
    updateSample: builder.mutation<
      ISampleListItem,
      { uuid: string; body: ISampleUpdatePayload }
    >({
      query: ({ uuid, body }) => {
        return {
          url: `samples/${uuid}/`,
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: (arg) => [{ type: 'Sample', id: arg?.id }],
    }),
    getAllTwaCalculations: builder.query<
      DjangoRestFrameworkResult<{ id: string; title: string }>,
      unknown
    >({
      query: () => `twa-calculations/`,
    }),
    getAllConstituents: builder.query<
      DjangoRestFrameworkResult<{ id: string; title: string }>,
      {
        constituentType?: string;
        searchTitle?: string;
      }
    >({
      query: ({ constituentType, searchTitle }) => {
        return {
          url: `constituents/`,
          params: {
            constituent_type: constituentType?.trim(),
            search: searchTitle,
          },
        };
      },
    }),
    registerLastCheckSample: builder.mutation<ILastChecked, { sample: string }>(
      {
        query: (body) => {
          return {
            url: `sample-checkins/`,
            method: 'POST',
            body,
          };
        },
        invalidatesTags: (arg) => [{ type: 'Sample', id: arg?.sample }],
      },
    ),
    downloadSamplePDFFile: builder.mutation<null, string | undefined>({
      queryFn: async (id, _api, _extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: `samples/${id}/export_pdf/`,
          responseHandler: (response) => response.blob(),
        });
        const hiddenElement = document.createElement('a');
        const url = window.URL || window.webkitURL;
        const blobExcel = url.createObjectURL(result.data as Blob);
        hiddenElement.href = blobExcel;
        hiddenElement.target = '_blank';
        hiddenElement.download = `sample-${id}.pdf`;
        hiddenElement.click();
        return { data: null };
      },
    }),
  }),
});

export const {
  useGetAllSamplesQuery,
  useGetAllSamplesBySurveyMomentQuery,
  useCreateSampleMutation,
  useGetSampleByIdQuery,
  useGetAllTwaCalculationsQuery,
  useGetAllConstituentsQuery,
  useRegisterLastCheckSampleMutation,
  useUpdateSampleMutation,
  useGetSampleResultByIdQuery,
  useDownloadSamplePDFFileMutation,
} = SampleApi;
