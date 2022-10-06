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

import { checkIfAlias, getAlias, getAliasValue } from '../utils/alias';
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
import { CircleBackslashIcon } from "@radix-ui/react-icons";
import { setegid } from "process";

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
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [searchWords, setSearchWords] = useState("");
  const [bgColor, setBgColor] = useState<string>(initBgColor);
  const [tokens, setTokens] = useState<
    { id: string; data: { label: string; value: string } }[]
  >(nodes.map((e) => ({ id: e.id, data: e.data })));

  const onLoad = (reactFlowInstance) =>
    console.log("flow loaded:", reactFlowInstance);
  const onNodeDragStop = (_: MouseEvent, node: Node) =>
    console.log("drag stop", node);
  const onElementClick = (_: MouseEvent, element: FlowElement) => {
    let temp = [];
    edges.map(ed => {
      if(ed.target === element.id || ed.source === element.id) {
        console.log(ed.style["stroke"]);
        if(ed.style.stroke === "red")
          ed["style"] = {stroke: "#b1b1b7", strokeWidth: 2};
        else
          ed["style"] = {stroke: "red", strokeWidth: 5};
      }
      else
        ed["style"] = {stroke: "#b1b1b7", strokeWidth: 2};
      temp.push(ed);
    });
    setEdges(temp);
  }

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

    let finalTokenArray = []; // Store the result of the tokens

    if(searchWords) {
      let searchWordArray = searchWords.replace(/([.,;]+)/g, " ").replace("/", " ").split(" ");
      let filterBySearchWordTokenArray = [];
      let aliasTokenArray = []; // Alias token array
      tokenArray.map(token => { // Get only filter by token's name
        let check = 1;
        searchWordArray.map(sch => {
          if(token.name.toLowerCase().indexOf(sch.toLowerCase()) === -1)
            check = 0;
        });
        if(check) filterBySearchWordTokenArray.push(token);
        if(token.type !== 'typography' && token.type !== 'boxShadow' && token.type !== 'composition'&& checkIfAlias(token.value)) aliasTokenArray.push(token);

      });

      filterBySearchWordTokenArray.map(token => { // Get all tokens related to search results

        finalTokenArray.push(token);
        // Get the target token if the search token is source token.

        if(token.type !== 'typography' && token.type !== 'boxShadow' && token.type !== 'composition'&& checkIfAlias(token.value)) {
          let temp = token;
          while(temp) { // Deep searching
            temp = tokenArray.find(secondToken => secondToken.name.indexOf(getAlias(temp.value)) !== -1);
            if(temp)
              finalTokenArray.push(temp);
          }
        }
        // Get the source token if the search token is target token.

        let firstRef = aliasTokenArray.filter(secondToken => token.name.indexOf(getAlias(secondToken.value)) !== -1);
        firstRef.map(tmp => { // Deep searching
          while(tmp) {
            finalTokenArray.push(tmp);
            tmp = aliasTokenArray.find(secondToken => tmp.name.indexOf(getAlias(secondToken.value)) !== -1);
          }
        });
      });

      finalTokenArray = finalTokenArray.filter(function(item, pos) { // remove duplicated tokens
        return finalTokenArray.indexOf(item) == pos;
      });
      
    } else {
      finalTokenArray = tokenArray;
    }
    
    const [initialNodes, initialEdges] = getFlowData(finalTokenArray);
    // Set the real value instead of alias(deep reference check)

    Object.keys(initialEdges).forEach(ed => {
      let temp = initialEdges[ed].source;
      while(initialEdges.find(o => o.target === temp)) {
        temp = initialEdges.find(o => o.target === temp).source;
      }
      initialNodes.find(item => item.id === initialEdges[ed].target).data.value = initialNodes.find(item => item.id === temp).data.value;
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [searchWords, tokenArray]);

  return (
    <Box style={{ height: '100' }} className="layoutflow">
      <ReactFlowProvider>
        <SearchBar setSearchWords={setSearchWords}/>
          <ReactFlow
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            onNodeClick={onElementClick}
            style={{ background: bgColor, top: 40 }}
            onLoad={onLoad}
            nodeTypes={nodeTypes}
            connectionLineStyle={connectionLineStyle}
            snapToGrid={true}
            snapGrid={snapGrid}
            defaultZoom={1}
            panOnScroll={true}
          >
            <Box style={{position: 'fixed', left: '200px', zIndex: '999', bottom: '0px'}}>
              <Controls />
            </Box>
            <Background gap={16} size={0.5} />
          </ReactFlow>
      </ReactFlowProvider>
    </Box>
  );
}
