import React from 'react';
import { PayloadActionCreator } from '@reduxjs/toolkit';

import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from './Debounce.hook';

export interface SearchActions {
  updateSearch: PayloadActionCreator<{ search: string }>;
}

export function useSearch<T extends { [key: string]: { search: string } }>(
  featureKey: string,
  actions: SearchActions,
) {
  const dispatch = useDispatch();
  const { updateSearch } = actions;

  const search = useSelector<T, string>((state) => state[featureKey].search);
  const debouncedSearch = useDebounce(search, 500);

  const onSearchChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    dispatch(updateSearch({ search: event.target.value }));
  };

  return {
    search,
    debouncedSearch,
    onSearchChange,
  };
}
