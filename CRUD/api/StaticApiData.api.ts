import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { DjangoRestFrameworkResult } from '@tes/utils-hooks';

interface IUnits {
  id: string;
  title: string;
}

export const StaticApiDataApi = createApi({
  reducerPath: 'StaticApiDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: async (headers, { extra }) => {
      headers.set('Authorization', `Bearer ${extra}`);
      return headers;
    },
  }),
  tagTypes: ['ApiData'],
  endpoints: (builder) => ({
    getAllUnits: builder.query<DjangoRestFrameworkResult<IUnits>, unknown>({
      query: () => `units/`,
    }),
  }),
});

export const { useGetAllUnitsQuery } = StaticApiDataApi;
