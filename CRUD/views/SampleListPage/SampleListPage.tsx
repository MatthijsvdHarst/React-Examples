import { Dispatch, SetStateAction, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Grid } from '@mui/material';

import { CrudListPageToolbar, CrudTable } from '@tes/crud';

import { useFetchList } from '../../hooks';
import { SampleCrudTableRow } from '../../ui';

export function SampleListPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHasBackButton] =
    useOutletContext<[boolean, Dispatch<SetStateAction<boolean>>]>();

  useEffect(() => setHasBackButton(false), [setHasBackButton]);

  const headCells = [
    {
      id: 'sampleId',
      label: 'Sample ID',
    },
    {
      id: 'sampler',
      label: 'Sampler',
    },
    {
      id: 'sample-date',
      label: 'Sample Date',
    },
  ];

  const {
    isLoading,
    isFetching,
    isSuccess,
    itemCount,
    itemList,

    itemsPerPage,
    page,
    onRowPerPageChange,
    onPageChange,

    search,
    debouncedSearch,
    onSearchChange,

    orderBy,
    onUpdateOrdering,
  } = useFetchList();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CrudListPageToolbar
          title="Samples"
          addLabel="New Sample"
          searchFieldPlaceholder="Search on samples"
          searchValue={search}
          onSearchChange={onSearchChange}
          onAddClick={() => {
            navigate('/');
          }}
          showAddButton={false}
        />
      </Grid>

      <Grid item xs={12}>
        {isSuccess && !isLoading && (
          <CrudTable
            title="Sampels"
            headCells={headCells}
            itemsPerPage={itemsPerPage}
            page={page}
            onRowsPerPageChange={onRowPerPageChange}
            onPageChange={onPageChange}
            orderBy={orderBy}
            onUpdateOrdering={onUpdateOrdering}
            isLoading={isLoading}
            isFetching={isFetching || search !== debouncedSearch}
            itemCount={itemCount}
            itemList={itemList}
            ItemRowComponent={SampleCrudTableRow}
          />
        )}
      </Grid>
    </Grid>
  );
}
