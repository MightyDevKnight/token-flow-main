import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TokenSetStatus } from "../constants/TokenSetStatus";

interface ThemeTokenSetState {
  activeTheme: string,
  availableThemes: AvailableTheme[],
  usedTokenSet: object,
	activeTokenSet: string,
	collapsedTokenSets: string[],
	themeObjects: ThemeObject[],
}
interface AvailableTheme {
	value: string,
	label: string,
}

export interface ThemeObject {
	id: string,
	name: string,
	selectedTokenSets: {},
}

const initialState: ThemeTokenSetState = {
	activeTheme: null,
	availableThemes: [{
		value: '',
		label: '',
	}],
	usedTokenSet: {
		global: 'disabled',
	},
	activeTokenSet: "",
	collapsedTokenSets: [],
	themeObjects: [],
}

const themeTokenSetState = createSlice({
	name: 'ThemeTokenSetState',
	initialState: initialState,
	reducers: {
		updateActiveTheme(state, action: PayloadAction<{activeTheme: string}>) {
			state.activeTheme = action.payload.activeTheme;
		},
    updateAvailableThemes(state, action: PayloadAction<{availableThemes: AvailableTheme[]}>) {
			state.availableThemes = action.payload.availableThemes;
		},
    updateUsedTokenSet(state, action: PayloadAction<{usedTokenSet: object}>) {
			state.usedTokenSet = action.payload.usedTokenSet;
		},
		updateActiveTokenSet(state, action: PayloadAction<{activeTokenSet: string}>){
			state.activeTokenSet = action.payload.activeTokenSet;
		},
		updateCollapsedTokenSets(state, action: PayloadAction<{collapsedTokenSet: string[]}>){
			state.collapsedTokenSets = action.payload.collapsedTokenSet;
		},
		updateTokenSetStatus(state, action: PayloadAction<{path: string}>){
			state.usedTokenSet[action.payload.path] = state.usedTokenSet[action.payload.path] === TokenSetStatus.DISABLED
				? TokenSetStatus.ENABLED
				: TokenSetStatus.DISABLED;
		},
		updateThemeObjects(state, action: PayloadAction<{themeObjects: ThemeObject[]}>){
			state.themeObjects = action.payload.themeObjects;
		}
	},
})

export const {
	updateActiveTheme,
  updateAvailableThemes,
  updateUsedTokenSet,
	updateActiveTokenSet,
	updateCollapsedTokenSets,
	updateTokenSetStatus,
	updateThemeObjects,
} = themeTokenSetState.actions;
export default themeTokenSetState;