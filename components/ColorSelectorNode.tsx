import React, { memo, FC, CSSProperties } from "react";

import {
  Handle,
  Position,
  NodeProps,
  Connection,
  Edge,
} from "react-flow-renderer";

import Box from "./Box";

const targetHandleStyle: CSSProperties = { background: "#555" };
const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle };

const onConnect = (params: Connection | Edge) =>
  console.log("handle onConnect", params);

const ColorSelectorNode: FC<NodeProps> = ({ data, isConnectable }) => {  
  const onChange = (color: string) => {
    console.log("handle onChange", color);
  };

  return (
    <Box style={{ padding: "8px", width: '344px', backgroundColor: '#fff' }}>
      <Handle
        type="target"
        position={Position.Left}
        style={targetHandleStyle}
        onConnect={onConnect}
      />
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box style={{ display: "flex", alignItems: "center" }}>
          <input
            className="nodrag"
            type="color"
            onChange={(e) => onChange(e.target.value)}
            value={data.value}
            style={{
              width: "24px",
              height: "24px",
              marginRight: "4px",
              padding: 0,
              border: 0,
              borderRadius: "4px",
              outline: "none",
            }}
          />
          <Box style={{ fontWeight: "bold", fontFamily: "monospace" }}>{data.name || "No name"}</Box>
        </Box>
        <Box style={{ color: "#3e3e3e", marginLeft: '16px', fontFamily: "monospace" }}>{data.value}</Box>
      </Box>
      <Handle
        type="source"
        position={Position.Right}
        style={sourceHandleStyleA}
        isConnectable={isConnectable}
      />
    </Box>
  );
};

export default memo(ColorSelectorNode);
