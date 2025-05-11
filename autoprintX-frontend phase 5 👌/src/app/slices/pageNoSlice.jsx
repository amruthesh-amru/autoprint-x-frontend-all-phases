import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const pageNoSlice = createSlice({
  name: "pageNumber",
  initialState,
  reducers: {
    setPageNumber: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPageNumber } = pageNoSlice.actions;

export default pageNoSlice.reducer;
