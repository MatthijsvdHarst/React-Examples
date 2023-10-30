import {
  useSearch,
  usePagination,
  useOrdering,
  mapListResult,
} from '@tes/utils-hooks';
import { useGetAllSamplesQuery } from '../api';
import {
  sampleActions,
  SAMPLE_FEATURE_KEY,
  SampleState,
} from '../sample.slice';

export function useFetchList() {
  const { itemsPerPage, page, onRowPerPageChange, onPageChange } =
    usePagination<{ [SAMPLE_FEATURE_KEY]: SampleState }>(
      SAMPLE_FEATURE_KEY,
      sampleActions,
    );

  const { search, debouncedSearch, onSearchChange } = useSearch<{
    [SAMPLE_FEATURE_KEY]: SampleState;
  }>(SAMPLE_FEATURE_KEY, sampleActions);

  const { orderBy, orderDirection, onUpdateOrdering } = useOrdering<{
    [SAMPLE_FEATURE_KEY]: SampleState;
  }>(SAMPLE_FEATURE_KEY, sampleActions);

  const response = useGetAllSamplesQuery(
    {
      search: debouncedSearch,
      page,
      limit: itemsPerPage,
      orderBy,
    },
    { refetchOnMountOrArgChange: true },
  );

  const { isFetching, isLoading, data, isSuccess } = response;
  const { itemCount, itemList } = mapListResult(data);

  const showPagination = itemCount > itemsPerPage;

  const pageCount = Math.ceil(itemCount / itemsPerPage);

  return {
    showPagination,
    pageCount,
    itemsPerPage,
    page,
    onRowPerPageChange,
    onPageChange,

    isLoading,
    isFetching,
    isSuccess,
    itemCount,
    itemList,

    search,
    debouncedSearch,
    onSearchChange,

    orderBy,
    orderDirection,
    onUpdateOrdering,
  };
}
