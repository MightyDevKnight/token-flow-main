import React, { useState, useEffect, MouseEvent, useCallback } from "react";
import { Provider, useSelector, useDispatch } from 'react-redux';
import store, { RootState } from "../store";


import Box from "./Box";
import NodeFlower from "./NodeFlower";
import { updateActiveTheme, updateAvailableThemes, updateThemeObjects, updateUsedTokenSet } from "../store/themeTokenSetState";
import Theme from "./Theme";
import type { ThemeObject } from "../store/themeTokenSetState";



export type HomeProps = {
  tokenArray: any;
  activeTheme: string;
  availableThemes: string;
  usedTokenSet: object;
  themeObjects: string,
}

export default function Home({
  tokenArray,
  activeTheme,
  availableThemes,
  usedTokenSet,
  themeObjects,
}: HomeProps) {
  const [firstTokenArray, setFirstTokenArray] = useState([]); // Store the filtered by tokenTypes
  const [finalTokenArray, setFinalTokenArray] = useState([]); // Store the filtered by tokenTypes & tokenSets
  const tokenTypeChecked = useSelector((state: RootState) => (state.tokenType)); // TokenTypes status
  const tokenSetsStatus = useSelector((state: RootState) => (state.themeTokenSet)).usedTokenSet; // TokenSets status

  const dispatch = useDispatch();
  const newThemeObjects: ThemeObject[] = themeObjects.split('---').map(themeObject => { // Analyze the Theme
    if(themeObject.length === 0)
      return themeObject;
    else
      return JSON.parse(themeObject);
  });
  let themes;
  if(availableThemes === ''){
    themes = availableThemes.split('');
  } else {
    themes = availableThemes.split('---').map(theme => {
      return JSON.parse(theme);
    });
  }
  useEffect(() => {
    dispatch(updateActiveTheme({activeTheme: activeTheme}));
    dispatch(updateAvailableThemes({availableThemes: themes}));
    dispatch(updateUsedTokenSet({usedTokenSet: usedTokenSet}));
    dispatch(updateThemeObjects({themeObjects: newThemeObjects}));
  },[]);

  useEffect(() =>{ // Filtering tokenTypes
    let enablesTokenTypes = [];
    Object.entries(tokenTypeChecked).forEach((tokenStatus) => { // Get the enabled tokenTypes
      if(tokenStatus[1] === false) {
        enablesTokenTypes.push(tokenStatus[0].toLowerCase());
      }
    });
    setFirstTokenArray(tokenArray.filter(token => enablesTokenTypes.includes(token.type.toLowerCase()))); // Filter by enabled tokenTypes
  }, [tokenTypeChecked]);

  useEffect(() => { // Filtering tokenSets
    let setStatus = [];
    Object.keys(tokenSetsStatus).forEach((sets) => { // Get enabled tokenSets
      if(tokenSetsStatus[sets] === "enabled") {
        setStatus.push(sets);
      }
    });

    let fillterByTokenSets = [];
    firstTokenArray.map(arr => { // Filter by enabled tokenSets
      for (let i = 0; i < setStatus.length; i ++) {
        if(arr.name.indexOf(setStatus[i]) !== -1)
          fillterByTokenSets.push(arr);
      }
    });

    setFinalTokenArray(fillterByTokenSets);

  }, [tokenSetsStatus, firstTokenArray])

  return (
    <Box style={{ display: 'flex'}}>
      <Theme />
      <NodeFlower
        tokenArray={finalTokenArray}
      />
    </Box>
  );
}
