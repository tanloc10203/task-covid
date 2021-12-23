import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import countriesApi from "../../apis/countriesApi";

const initialState = {
  data: {},
  isLoading: false,
  day: 30,
}

const getCountryDataByDay = createAsyncThunk(
  "country/getCountryDataByDay",
  async (country, dayInput) => {
    const response = await countriesApi.getDadaCountryByDay(country, dayInput);
    return response.data;
  }
)

const CountrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setState(state, action) {
      state.day = action.payload;
    }
  },
  extraReducers: {
    [getCountryDataByDay.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getCountryDataByDay.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    },
    [getCountryDataByDay.rejected]: (state, action) => {
      state.isLoading = false;
      state.data = {};
    }
  }
});

const { reducer, actions } = CountrySlice;

export { getCountryDataByDay };
export const { setState } = actions;
export default reducer;