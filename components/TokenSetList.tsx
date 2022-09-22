import React, { useCallback, useEffect } from 'react';
import compact from 'just-compact';
import { useDispatch, useSelector } from 'react-redux';
import {
  Reorder, useDragControls, useMotionValue,
} from 'framer-motion';
import Box from './Box';
import { RootState } from '../store';
import { TokenSetItem } from './TokenSetItem';
import { TokenSetStatus } from '../constants/TokenSetStatus';
import { TokenSetListOrTree } from './TokenSetListOrTree';
import { useRaisedShadow } from './use-raised-shadow';
import { tokenSetListToList, TreeItem } from '../utils/tokenset';
import { updateActiveTheme, updateActiveTokenSet, updateAvailableThemes, updateTokenSetStatus, updateUsedTokenSet } from "../store/themeTokenSetState";

type ExtendedTreeItem = TreeItem & {
  tokenSets: string[];
};
type TreeRenderFunction = (props: React.PropsWithChildren<{
  item: ExtendedTreeItem
}>) => React.ReactNode;
type Props = {
  tokenSets: string[];
};

function TokenSetListItem({ item, children }: Parameters<TreeRenderFunction>[0]) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const controls = useDragControls();

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={controls}
      value={item}
      style={{ boxShadow, y }}
    >
      {children}
    </Reorder.Item>
  )
}

export function TokenSetListItemContent({ item }: Parameters<TreeRenderFunction>[0]) {

  const activeTokenSet = useSelector((state: RootState) => (state.themeTokenSet)).activeTokenSet;
  const usedTokenSet = useSelector((state: RootState) => (state.themeTokenSet)).usedTokenSet;
  const dispatch = useDispatch();

  const handleClick = useCallback(async (set: TreeItem) => {
    if (set.isLeaf) {
        dispatch(updateActiveTokenSet({activeTokenSet: set.path}));
      }
  }, [dispatch]);

  const handleCheckedChange = useCallback((checked: boolean, item: TreeItem) => {
    dispatch(updateTokenSetStatus({path: item.path}));
  }, [dispatch]);

  return (
    <TokenSetItem
      key={item.key}
      isActive={activeTokenSet === item.path}
      onClick={handleClick}
      isChecked={usedTokenSet?.[item.path] === TokenSetStatus.ENABLED || (
        usedTokenSet?.[item.path] === TokenSetStatus.SOURCE ? 'indeterminate' : false
      )}
      item={item}
      onCheck={handleCheckedChange}
    />
  );
}
export default function TokenSetList({
  tokenSets,
}: Props) {
  const [items, setItems] = React.useState(tokenSetListToList(tokenSets));

  const mappedItems = React.useMemo(() => (
    items.map<ExtendedTreeItem>((item) => ({
      ...item,
      tokenSets,
    } as unknown as ExtendedTreeItem))
  ), [items, tokenSets]);

  const handleReorder = React.useCallback((reorderedItems: ExtendedTreeItem[]) => {
    const nextItems = compact(
      reorderedItems.map((item) => (
        items.find(({ key }) => item.key === key)
      )),
    );
    setItems(nextItems);
  }, [items]);

  useEffect(() => {
    setItems(tokenSetListToList(tokenSets));
  }, [tokenSets]);

  // TODO: Handle reorder at end doesnt work yet
  return (
    <Box>
      <Reorder.Group axis="y" layoutScroll values={mappedItems} onReorder={handleReorder}>
        <TokenSetListOrTree<ExtendedTreeItem>
          displayType="tree"
          items={mappedItems}
          renderItem={TokenSetListItem}
          renderItemContent={TokenSetListItemContent}
        />
      </Reorder.Group>
    </Box>
  );
}
