import React, { useMemo, useCallback } from "react";
import { TokenTypes } from "../constants/TokenTypes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuItemIndicator, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./DropdownMenu";
import { Flex } from "./Flex";
import Text  from './Text';
import TreeItem from "./TreeItem";
import { styled } from "../stitches.config";
import IconToggleableDisclosure from "./IconToggleableDisclosure";
import Box from "./Box";
import Heading from "./Heading";
import { CheckIcon } from "@radix-ui/react-icons";
import { updateActiveTheme, updateUsedTokenSet } from "../store/themeTokenSetState";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import TokenSetTree from "./TokenSetTree";

const ThemeDropdownLabel = styled(Text, {
  marginRight: '$2',
});

interface AvailableTheme {
  value: string,
  label: string,
}

export default function Theme(){
  const dispatch = useDispatch();

  const activeTheme = useSelector((state: RootState) => (state.themeTokenSet)).activeTheme;
  const availableThemes: AvailableTheme[] = useSelector((state: RootState) => (state.themeTokenSet)).availableThemes;
  const usedTokenSet = useSelector((state: RootState) => (state.themeTokenSet)).usedTokenSet;
  const themeObjects = useSelector((state: RootState) => (state.themeTokenSet)).themeObjects;
  const activeThemeLabel = useMemo(() => {
    if (activeTheme && availableThemes.length > 0) {
      const themeOption = availableThemes.find(( theme: AvailableTheme ) => (theme.value  === activeTheme));
      return themeOption ? themeOption?.label : 'Unknown';
    }
    return 'None';
  }, [activeTheme, availableThemes]);

  const handleSelectTheme = useCallback((themeId: string) => {
    if(activeTheme !== themeId){
      dispatch(updateActiveTheme({activeTheme: themeId}));
      const newThemeObject = themeObjects.find((themeObject) => themeObject.id === themeId);
      dispatch(updateUsedTokenSet({usedTokenSet: newThemeObject.selectedTokenSets}));
    }
  }, [activeTheme, dispatch, themeObjects]);

  const availableThemeOptions = useMemo(() => (
    availableThemes.map(({ label, value }) => {
      const handleSelect = () => handleSelectTheme(value);

      return (
        <DropdownMenuRadioItem
          key={value}
          value={value}
          data-cy={`themeselector--themeoptions--${value}`}
          // @README we can disable this because we are using Memo for the whole list anyways
          // eslint-disable-next-line react/jsx-no-bind
          onSelect={handleSelect}
        >
          <DropdownMenuItemIndicator>
            <CheckIcon />
          </DropdownMenuItemIndicator>
          {label}
        </DropdownMenuRadioItem>
      );
    })
  ), [availableThemes, handleSelectTheme]);

  return (
    <Box css={{ justifyContent: 'space-between', alignItems: 'center', width: '200px', padding: '10px' }}>
      <Heading muted size="small">Theme</Heading>
      <Flex alignItems="center" css={{ flexShrink: 0 }}>
        <DropdownMenu>
          <DropdownMenuTrigger data-cy="themeselector-dropdown">
            <Flex>
              <ThemeDropdownLabel size="small">{activeThemeLabel}</ThemeDropdownLabel>
              <IconToggleableDisclosure />
            </Flex>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" css={{ minWidth: '180px' }}>
          <DropdownMenuRadioGroup value={activeTheme ?? ''}>
            {availableThemes.length === 0 && (
              <DropdownMenuRadioItem value="" disabled={!activeTheme}>
                <Text>No themes</Text>
              </DropdownMenuRadioItem>
            )}
            {availableThemeOptions}
          </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Flex>
      <Box>Types</Box>
      <Box>
        {Object.values(TokenTypes)?.map((_tokenType) => (
          <TreeItem tokenType={_tokenType} key={_tokenType}/>
        ))}
      </Box>
      <Box style = {{marginTop: '20px'}}>TokenSets</Box>
      <TokenSetTree tokenSets={Object.keys(usedTokenSet)} />
    </Box>
  )
}