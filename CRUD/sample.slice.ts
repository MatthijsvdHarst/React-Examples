import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const SAMPLE_FEATURE_KEY = 'sample';

/*
 * Update these interfaces according to your requirements.
 */
export interface SampleEntity {
  id: number;
}

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface SampleState extends EntityState<SampleEntity> {
  needsRefetch: boolean;
  itemsPerPage: number;
  page: number;
  orderBy: string;
  orderDirection: OrderDirection;
  search: string;
}

export const sampleAdapter = createEntityAdapter<SampleEntity>();

export const initialSampleState: SampleState = sampleAdapter.getInitialState({
  needsRefetch: false,
  itemsPerPage: 10,
  page: 0,
  orderBy: '',
  orderDirection: OrderDirection.ASC,
  search: '',
});

export const sampleSlice = createSlice({
  name: SAMPLE_FEATURE_KEY,
  initialState: initialSampleState,
  reducers: {
    updateNeedsRefetch: (state: SampleState, { payload: { needsRefetch } }) => {
      state.needsRefetch = needsRefetch;
    },
    updatePage: (state: SampleState, { payload: { page } }) => {
      state.page = page;
    },
    updateItemsPerPage: (state: SampleState, { payload: { itemsPerPage } }) => {
      state.itemsPerPage = itemsPerPage;
    },
    updateOrdering: (state: SampleState, { payload: { orderBy } }) => {
      state.orderDirection =
        state.orderBy === orderBy && state.orderDirection === OrderDirection.ASC
          ? OrderDirection.DESC
          : OrderDirection.ASC;
      state.orderBy = orderBy;
    },
    updateSearch: (state: SampleState, { payload: { search } }) => {
      state.search = search;
    },
  },
});

export const sampleReducer = sampleSlice.reducer;

export const sampleActions = sampleSlice.actions;

const { selectAll, selectEntities } = sampleAdapter.getSelectors();

export const getSampleState = (rootState: {
  [SAMPLE_FEATURE_KEY]: SampleState;
}): SampleState => rootState[SAMPLE_FEATURE_KEY];

export const selectAllSample = createSelector(getSampleState, selectAll);

export const selectSampleEntities = createSelector(
  getSampleState,
  selectEntities,
);
