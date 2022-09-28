import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenTypeStatusState {
	Other: Boolean,
	Color: Boolean,
	BorderRadius: Boolean,
	Sizing: Boolean,  
	Spacing: Boolean,
	Text: Boolean,
	Typography: Boolean,
	Opacity: Boolean,
	BorderWidth: Boolean,
	BoxShadow: Boolean,
	FontFamilies: Boolean,
	FontWeights: Boolean,
	LineHeights: Boolean,
	FontSizes: Boolean,
	LetterSpacing: Boolean,
	ParagraphSpacing: Boolean,
	TextDecoration: Boolean,
	TextCase: Boolean,
	Composition: Boolean,
}

const initialState: TokenTypeStatusState = {
	Other: false,
	Color: false,
	BorderRadius: false,
	Sizing: false,  
	Spacing: false,
	Text: false,
	Typography: false,
	Opacity: false,
	BorderWidth: false,
	BoxShadow: false,
	FontFamilies: false,
	FontWeights: false,
	LineHeights: false,
	FontSizes: false,
	LetterSpacing: false,
	ParagraphSpacing: false,
	TextDecoration: false,
	TextCase: false,
	Composition: false,
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