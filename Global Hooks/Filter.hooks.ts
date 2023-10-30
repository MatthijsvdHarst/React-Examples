import { useState, useMemo } from 'react';

interface IItem {
  id: number | string;
  title: string;
}

export function useFilter<T>(
  key: string,
  title: string,
  rawItems: Array<T>,
  itemFormatter: (item: T) => IItem,
) {
  const [value, updateFilter] = useState(
    {} as { [key: string | number]: true },
  );

  const items = useMemo(
    () => rawItems.map(itemFormatter),
    [itemFormatter, rawItems],
  );

  const toggleFilter = (id: string | number) => {
    const newSelection = { ...value };

    if (value[id] === true) {
      delete newSelection[id];
    } else {
      newSelection[id] = true;
    }

    updateFilter(newSelection);
  };

  return {
    key,
    title,
    items,
    value,
    updateFilter,
    toggleFilter,
  };
}
