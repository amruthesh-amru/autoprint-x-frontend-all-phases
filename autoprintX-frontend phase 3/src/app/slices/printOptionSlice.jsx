// src/app/slices/printOptionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    fileName: "",
    paperSize: "A4",
    color: "color",
    duplex: false,
    copies: 1,
    orientation: "portrait",
    pageRange: "",
    selectAll: false,
    binding: "none",
    estimatedCost: 0,
  },
};

const printOptionSlice = createSlice({
  name: "printOption",
  initialState,
  reducers: {
    // Update a single field in the options.
    setOptionField: (state, action) => {
      const { key, value } = action.payload;
      state.value[key] = value;
    },
    // (Optional) Update the entire options object.
    setOption: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setOptionField, setOption } = printOptionSlice.actions;
export default printOptionSlice.reducer;
