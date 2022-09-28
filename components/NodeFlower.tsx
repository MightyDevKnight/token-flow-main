import React, { useState, useEffect, MouseEvent, useCallback } from "react";
import { Provider, useSelector, useDispatch } from 'react-redux';

import ReactFlow, {
  isEdge,
  addEdge,
  Controls,
  Node,
  FlowElement,
  OnLoadParams,
  Elements,
  SnapGrid,
  Connection,
  Background,
  Edge,
  isNode,
  ReactFlowProvider,
  updateEdge,
  getIncomers,
  getConnectedEdges,
  getOutgoers,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";

import Box from "./Box";
import SearchBar from "./SearchBar";
import ColorSelectorNode from "./ColorSelectorNode";
import ParentNode from "./ParentNode";
import GroupNode from "./GroupNode";
import LoadingSpinner from "./Loading";
import { getFlowData } from "./initialElements";
import Theme from "./Theme";
import store, { RootState } from "../store";
import { ThemeDataTypes } from '../utils/types';

const onLoad = (reactFlowInstance) => {
  console.log("flow loaded:", reactFlowInstance);
  // reactFlowInstance.fitView();
}
const onNodeDragStop = (_: MouseEvent, node: Node) =>
  console.log("drag stop", node);
const onElementClick = (_: MouseEvent, element: FlowElement) =>
  console.log("click", element);

const initBgColor = "#F6F8FA";

const connectionLineStyle = { stroke: "#fff" };
const snapGrid: SnapGrid = [16, 16];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
  parent: ParentNode,
  group: GroupNode,
};

export type TokenFlowData = {
  tokenArray: any;
}

export default function NodeFlower({
  tokenArray,
}: TokenFlowData) {

  const tokenTypeChecked = useSelector((state: RootState) => (state.tokenType));
  const usedTokenSet = useSelector((state: RootState) => (state.themeTokenSet)).usedTokenSet;
  

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [searchWords, setSearchWords] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bgColor, setBgColor] = useState<string>(initBgColor);
  const [tokens, setTokens] = useState<
    { id: string; data: { label: string; value: string } }[]
  >(nodes.map((e) => ({ id: e.id, data: e.data })));


  const onNodesChange = useCallback((changes) => setNodes((ns) => applyNodeChanges(changes, ns)), []);
  const onEdgesChange = useCallback((changes) => setEdges((es) => applyEdgeChanges(changes, es)), []);    

  const onConnect = (params: Connection | Edge) => {
    const node = nodes.find((e) => e.id === params.target);
    const connectedEdges = getConnectedEdges([node], edges).filter(e => e.target === node.id);
    let newNodes = nodes
    let newEdges = edges
    if (connectedEdges.length > 0) {
      newEdges = applyEdgeChanges(connectedEdges.map(edge => ({id: edge.id, type: 'remove'})), newEdges);
    }
    newEdges = addEdge({ ...params }, newEdges);
    
    const newSource = nodes.find((e) => e.id === params.source);
    const outgoers = getOutgoers(node, nodes, edges);
    
    newNodes = newNodes.map(el => {return el.id === node.id ? {...el, data: {...el.data, value: newSource.data.value}} : el} )
    
    if (outgoers.length > 0) {
      outgoers.forEach(out => {
        const outgoerIndex = newNodes.findIndex(el => el.id === out.id); 
        newNodes[outgoerIndex] = {...newNodes[outgoerIndex], data: {...newNodes[outgoerIndex].data, value: newSource.data.value}}
      })
    }
    
    setNodes(() => {
      return newNodes;
    });
    setEdges(() => {
      return newEdges;
    });

    // const newTokens = [...tokens];
    // const tokenIndex = newTokens.findIndex((t) => t.id === params.target);
    // const token = {
    //   ...newTokens[tokenIndex],
    //   data: { ...newTokens[tokenIndex].data, value: `{${params.source}}` },
    // };

    // newTokens[tokenIndex] = token;
    // setTokens(newTokens);
  };

  useEffect(() => {
    let newFilter = [];
    Object.entries(tokenTypeChecked).forEach((tokenStatus) => {
      if(tokenStatus[1] === false) {
        newFilter.push(tokenStatus[0].toLowerCase());
      }
    });
    const newTokenArray = tokenArray.filter(token => newFilter.includes(token.type.toLowerCase()));
    const [firstNodes, firstEdges] = getFlowData(newTokenArray);
    const newEdges= [];
    let temp = searchWords.replace(/([.,;]+)/g, " ");
    let sWord = temp.replace("/", " ").split(" ");
    firstEdges.map((edge) => {
      let check = 1;
      sWord.map(sch => {
        if(edge.id.indexOf(sch) === -1)
          check = 0;
      });
      if(check)
        newEdges.push(edge);
    });
    let filterArray = [];
    if(!searchWords)
      filterArray = newTokenArray;
    else {
      newTokenArray.map((token) => {
        let flag = 0;
        newEdges.map((edge) => {
          if((token.name === edge.source || token.name === edge.target))
            flag = 1;
        });
        if(flag === 1) {
          filterArray.push(token);
        }
      });
    }
    let tokenSetsStatus = [];
    Object.keys(usedTokenSet).forEach((sets) => {
      if(usedTokenSet[sets] === "enabled") {
        tokenSetsStatus.push(sets);
      }
    });
    // const [initialNodes, initialEdges] = getFlowData(filterArray);
    // let tokenSetsEdges = [];
    // tokenSetsStatus.map((status) => {
    //   Object.keys(initialEdges).forEach((ed) => {
    //     if(initialEdges[ed].source.includes(status)) {
    //       tokenSetsEdges.push(initialEdges[ed]);
    //       initialNodes.find(item => item.id === initialEdges[ed].target).data.value = initialNodes.find(item => item.id === initialEdges[ed].source).data.value;
    //     }
    //   });
    // });
    let fillterByTokenSets = [];
    filterArray.map(arr => {
      for (let i = 0; i < tokenSetsStatus.length; i ++) {
        if(arr.name.indexOf(tokenSetsStatus[i]) !== -1)
          fillterByTokenSets.push(arr);
      }
    });
    const [initialNodes, initialEdges] = getFlowData(fillterByTokenSets);
    Object.keys(initialEdges).forEach(ed => {
      initialNodes.find(item => item.id === initialEdges[ed].target).data.value = initialNodes.find(item => item.id === initialEdges[ed].source).data.value;
    });
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [searchWords, tokenTypeChecked, usedTokenSet]);

  useEffect(() => {
    setIsLoading(false);
  }, [nodes, edges])

  return (
    <Box style={{ height: '100' }} className="layoutflow">
      <ReactFlowProvider>
        <SearchBar setSearchWords={setSearchWords} setIsLoading={setIsLoading}/>
        {isLoading
          ?
          <LoadingSpinner/>
          :
          <ReactFlow
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            style={{ background: bgColor }}
            onLoad={onLoad}
            nodeTypes={nodeTypes}
            connectionLineStyle={connectionLineStyle}
            snapToGrid={true}
            snapGrid={snapGrid}
            defaultZoom={1}
            panOnScroll={true}
          >
            <Controls />
            <Background gap={16} size={0.5} />
          </ReactFlow>
        }
      </ReactFlowProvider>
    </Box>
  );
}
