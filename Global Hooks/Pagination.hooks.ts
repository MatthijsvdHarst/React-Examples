import React from 'react';

import { PayloadActionCreator } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

export interface PaginationActions {
  updateItemsPerPage: PayloadActionCreator<{ itemsPerPage: number }>;
  updatePage: PayloadActionCreator<{ page: number }>;
}

export function usePagination<
  T extends { [key: string]: { page: number; itemsPerPage: number } },
>(featureKey: string, actions: PaginationActions) {
  const dispatch = useDispatch();
  const { updatePage, updateItemsPerPage } = actions;

  const itemsPerPage = useSelector<T, number>(
    (state) => state[featureKey].itemsPerPage,
  );
  const page = useSelector<T, number>((state) => state[featureKey].page);

  const onRowPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateItemsPerPage({
        itemsPerPage: parseInt(event.target.value, 10),
      }),
    );
    dispatch(updatePage({ page: 0 }));
  };

  const onPageChange = (
    _event: React.ChangeEvent<unknown> | React.MouseEvent | null,
    nextPage: number,
  ) => dispatch(updatePage({ page: nextPage }));

  return {
    itemsPerPage,
    page,
    onRowPerPageChange,
    onPageChange,
  };
}
