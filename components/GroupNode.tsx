import React, { memo, FC, CSSProperties } from "react";

import {
  Handle,
  Position,
  NodeProps,
  Connection,
  Edge,
} from "react-flow-renderer";

import Box from "./Box";

const onConnect = (params: Connection | Edge) =>
  console.log("handle onConnect", params);

const GroupNode: FC<NodeProps> = ({ data, isConnectable }) => {
  const onChange = (color: string) => {
    console.log("handle onChange", color);
  };

  return (
      <Box>
        {data.label}
      </Box>
  );
};

export default memo(GroupNode);
