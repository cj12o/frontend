import { createSlice } from "@reduxjs/toolkit";

export type SearchQuery = {
  need: number;
  keyword: string;
};

const searchSlice = createSlice({
  name: "search",
  initialState: {
    queryforDynamicSearch: { need: -1, keyword: "" } as SearchQuery,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.queryforDynamicSearch = action.payload;
    },
    clearSearchQuery: (state) => {
      state.queryforDynamicSearch = { need: -1, keyword: "" };
    },
  },
});

export const { setSearchQuery, clearSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
