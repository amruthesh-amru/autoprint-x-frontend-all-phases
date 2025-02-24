import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API } from "@/utils/api";

// Async function to check authentication
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API.CHECK_AUTH, {
        withCredentials: true,
      });
      return response.data.customer;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Auth check failed");
    }
  }
);

const initialState = {
  customer: null,
  loading: false,
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
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.customer = null;
      });
  },
});

export const { setCustomer, clearCustomer } = userSlice.actions;
export default userSlice.reducer;
