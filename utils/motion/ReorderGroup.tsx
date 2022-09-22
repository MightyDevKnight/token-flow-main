/* adapted from framer-motion */
import {
  HTMLMotionProps, motion,
} from 'framer-motion';
import * as React from 'react';
import {
  useEffect,
  useRef,
  useMemo,
} from 'react';
import { ItemData, ReorderContext, ReorderContextProps } from '../context';

export interface Props<V> {
  values: V[]
}

function getValue<V>(item: ItemData<V>) {
  return item.value;
}

function compareMin<V>(a: ItemData<V>, b: ItemData<V>) {
  return a.layout.min - b.layout.min;
}

export function ReorderGroup<V>(
  {
    children,    
    values,
    ...props
  }: Props<V> & HTMLMotionProps<any> & React.PropsWithChildren<unknown>,
) {
  const Component = motion.ul;

  const order: ItemData<V>[] = [];
  const isReordering = useRef(false);

  const context = useMemo<ReorderContextProps<any>>(() => ({
    axis: 'y',
    registerItem: (value, layout) => {
      if (
        layout
        && order.findIndex((entry) => value === entry.value) === -1
      ) {
        order.push({ value, layout: layout.y });
        order.sort(compareMin);
      }
    },
    updateOrder: (id, offset, velocity) => {
      if (isReordering.current) return;
    },
  }), [order]);

  useEffect(() => {
    isReordering.current = false;
  });

  return (
    <Component {...props}>
      <ReorderContext.Provider value={context}>
        {children}
      </ReorderContext.Provider>
    </Component>
  );
}
