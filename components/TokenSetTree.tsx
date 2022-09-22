import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TokenSetItem } from './TokenSetItem';
import { RootState } from '../store';
import { TokenSetStatus } from '../constants/TokenSetStatus';
import { TokenSetListOrTree } from './TokenSetListOrTree';
import { tokenSetListToTree, TreeItem } from '../utils/tokenset';
import { updateActiveTokenSet, updateTokenSetStatus } from '../store/themeTokenSetState';
import { ReorderGroup } from '../utils/motion/ReorderGroup';

export default function TokenSetTree({
  tokenSets,
}: { tokenSets: string[]}) {
  const activeTokenSet = useSelector((state: RootState) => (state.themeTokenSet)).activeTokenSet;
  const usedTokenSet = useSelector((state: RootState) => (state.themeTokenSet)).usedTokenSet;
  const dispatch = useDispatch();
  const [items, setItems] = useState<TreeItem[]>(tokenSetListToTree(tokenSets));
  
  const determineCheckedState = useCallback((item: TreeItem) => {
    if (item.isLeaf) {
      if (usedTokenSet?.[item.path] === TokenSetStatus.SOURCE) {
        return 'indeterminate';
      }
      return usedTokenSet?.[item.path] === TokenSetStatus.ENABLED;
    }

    const itemPaths = items.filter((i) => i.path.startsWith(item.path) && i.path !== item.path).map((i) => i.path);
    const childTokenSetStatuses = Object.entries(usedTokenSet)
      .filter(([tokenSet]) => itemPaths.includes(tokenSet))
      .map(([, tokenSetStatus]) => tokenSetStatus);

    if (childTokenSetStatuses.every((status) => (
      status === TokenSetStatus.ENABLED
    ))) {
      // @README all children are ENABLED
      return true;
    }

    if (childTokenSetStatuses.some((status) => (
      status === TokenSetStatus.ENABLED
      || status === TokenSetStatus.SOURCE
    ))) {
      // @README some children are ENABLED or treated as SOURCE
      return 'indeterminate';
    }

    return false;
  }, [items, usedTokenSet]);

  const mappedItems = useMemo(() => (
    items.map((item) => ({
      ...item,
      isActive: activeTokenSet === item.path,
      checkedState: determineCheckedState(item) as ReturnType<typeof determineCheckedState>,
    }))
  ), [items, activeTokenSet, determineCheckedState]);  

  const handleCheckedChange = useCallback((shouldCheck: boolean, set: typeof items[number]) => {
    if (set.isLeaf) {
      dispatch(updateTokenSetStatus({path: set.path}));
    } else {
      const itemPaths = items.filter((i) => i.path.startsWith(set.path) && i.path !== set.path).map((i) => i.path);
      const reorderedPaths = Array.from(new Set(itemPaths));
      reorderedPaths.forEach((path => {
        dispatch(updateTokenSetStatus({path: path}));
      }))
    }
  }, [dispatch, items]);

  const handleClick = useCallback((set: typeof items[number]) => {
    if (set.isLeaf) {
      dispatch(updateActiveTokenSet({activeTokenSet: set.path}));
    }
  }, [dispatch]);

  type TreeRenderFunction = (props: React.PropsWithChildren<{ item: typeof mappedItems[number] }>) => React.ReactElement;

  const renderItem = useCallback<TreeRenderFunction>(({ children }) => (
    React.createElement(React.Fragment, {}, children)
  ), []);

  const renderItemContent = useCallback<TreeRenderFunction>(({ item, children }) => (
    <>
      {children}
      <TokenSetItem
        key={item.path}
        isActive={item.isActive}
        onClick={handleClick}
        isChecked={item.checkedState}
        item={item}
        onCheck={handleCheckedChange}
      />
    </>
  ), [handleCheckedChange, handleClick]);

  useEffect(() => {
    setItems(tokenSetListToTree(tokenSets));    
  }, [tokenSets]);

  return (
    <ReorderGroup
      layoutScroll
      values={mappedItems} 
    >
      <TokenSetListOrTree
        displayType="tree"
        items={mappedItems}
        renderItem={renderItem}
        renderItemContent={renderItemContent}
      />
    </ReorderGroup>
    
  );
}
