// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customer: null, // or {} if you prefer
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    clearCustomer: (state) => {
      state.customer = null;
    },
  },
});

export const { setCustomer, clearCustomer } = userSlice.actions;
export default userSlice.reducer;
