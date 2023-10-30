import { useState, useMemo } from 'react';

export enum SelectionState {
  ALL = 'ALL',
  SOME = 'SOME',
  NONE = 'NONE',
}

interface ItemWithId {
  id: string | number;
}

export function useListSelectionControls<T extends ItemWithId>(
  itemCount: number,
  itemsPerPage: number,
  itemList: Array<T>,
) {
  const [selection, updateSelection] = useState(
    {} as { [key: string | number]: true },
  );
  const selectionCount = Object.keys(selection).length;

  const selectionState = useMemo(() => {
    if (selectionCount === 0 || itemCount === 0) {
      return SelectionState.NONE;
    }

    if (selectionCount < itemCount && selectionCount < itemsPerPage) {
      return SelectionState.SOME;
    }

    return SelectionState.ALL;
  }, [itemCount, itemsPerPage, selectionCount]);

  const onToggleSelectAll = () => {
    if (selectionState === SelectionState.NONE) {
      const selection = itemList.reduce(
        (acc, item) => ({ ...acc, [item.id]: true }),
        {},
      );
      updateSelection(selection);
      return;
    }
    updateSelection({});
  };

  const onToggleSelect = (id: string | number) => {
    const newSelection = { ...selection };

    if (selection[id] === true) {
      delete newSelection[id];
    } else {
      newSelection[id] = true;
    }

    updateSelection(newSelection);
  };

  return {
    selection,
    selectionState,
    onToggleSelectAll,
    onToggleSelect,
  };
}
