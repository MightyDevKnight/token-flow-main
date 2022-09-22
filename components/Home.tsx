import React, { useState, useEffect, MouseEvent, useCallback } from "react";
import { Provider, useSelector, useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();
  const newThemeObjects: ThemeObject[] = themeObjects.split('---').map(themeObject => {
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
  },[activeTheme, dispatch, newThemeObjects, themeObjects, themes, usedTokenSet]);
  return (
    <Box style={{ display: 'flex'}}>
      <Theme />
      <NodeFlower
        tokenArray={tokenArray}
      />
    </Box>
  );
}
