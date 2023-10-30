import { useDispatch, useSelector } from 'react-redux';
import { PayloadActionCreator } from '@reduxjs/toolkit';

export interface OrderingActions {
  updateOrdering: PayloadActionCreator<{ orderBy: string | number }>;
}

enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export function useOrdering<
  T extends {
    [key: string]: { orderBy: string; orderDirection: OrderDirection };
  },
>(featureKey: string, actions: OrderingActions) {
  const dispatch = useDispatch();
  const { updateOrdering } = actions;

  const orderBy = useSelector<T, string>((state) => state[featureKey].orderBy);
  const orderDirection = useSelector<T, OrderDirection>(
    (state) => state[featureKey].orderDirection,
  );

  const onUpdateOrdering = (id: string | number) =>
    dispatch(updateOrdering({ orderBy: id }));

  return { orderBy, orderDirection, onUpdateOrdering };
}
