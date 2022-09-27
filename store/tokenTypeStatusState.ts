import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenTypeStatusState {
	other: Boolean,
	color: Boolean,
	borderRadius: Boolean,
	sizing: Boolean,  
	spacing: Boolean,
	text: Boolean,
	typography: Boolean,
	opacity: Boolean,
	borderWidth: Boolean,
	boxShadow: Boolean,
	fontFamilies: Boolean,
	fontWeights: Boolean,
	lineHeights: Boolean,
	fontSizes: Boolean,
	letterSpacing: Boolean,
	paragraphSpacing: Boolean,
	textDecoration: Boolean,
	textCase: Boolean,
	composition: Boolean,
}

const initialState: TokenTypeStatusState = {
	other: false,
	color: false,
	borderRadius: false,
	sizing: false,  
	spacing: false,
	text: false,
	typography: false,
	opacity: false,
	borderWidth: false,
	boxShadow: false,
	fontFamilies: false,
	fontWeights: false,
	lineHeights: false,
	fontSizes: false,
	letterSpacing: false,
	paragraphSpacing: false,
	textDecoration: false,
	textCase: false,
	composition: false,
}

const tokenTypeStatus = createSlice({
	name: 'TokeTypesStatus',
	initialState: initialState,
	reducers: {
		updateTokenTypeStatus(state, action: PayloadAction<{name: string}>) {
			state[action.payload.name] = !state[action.payload.name];
		}
	},
})

export const {
	updateTokenTypeStatus
} = tokenTypeStatus.actions;
export default tokenTypeStatus;