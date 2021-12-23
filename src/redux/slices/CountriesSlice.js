import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import countriesApi from "../../apis/countriesApi";
import _ from "lodash";

const initialState = {
  data: [],
  data_country: {},
  isLoading: false,
  isLoadingDataSummary: false,
  iso2: "VN",
  data_country_point: [],
  isLoadingDataPoint: false
}

const getDataSummary = createAsyncThunk("countries/getDataSummary", async slug => {
  const response = await countriesApi.getReportByCountry(slug);
  return response.data;
});

const getCountriesPoint = createAsyncThunk("countries/getCountriesPoint", async () => {
  const response = await countriesApi.getCountriesPoint();
  return response.data;
});

const getCountries = createAsyncThunk("countries/get", async () => {
  const response = await countriesApi.getCountries();
  return response.data;
});

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setState(state, action) {
      state.iso2 = action.payload;
    }
  },
  extraReducers: {
    [getCountries.pending]: state => {
      state.isLoading = true;
    },
    [getCountries.fulfilled]: (state, action) => {
      const response = _.sortBy(action.payload, 'Country');
      state.data = response;
      state.isLoading = false;
    },
    [getCountries.rejected]: state => {
      state.isLoading = false;
    },
    [getDataSummary.pending]: (state, action) => {
      state.isLoadingDataSummary = true;
    },
    [getDataSummary.fulfilled]: (state, action) => {
      // action.payload?.pop(); // cut last item 
      state.data_country = action.payload;
      state.isLoadingDataSummary = false;
    },
    [getDataSummary.rejected]: (state, action) => {
      state.isLoadingDataSummary = false;
    },
    [getCountriesPoint.pending]: (state, action) => {
      state.isLoadingDataPoint = true;
    },
    [getCountriesPoint.fulfilled]: (state, action) => {
      state.data_country_point = action.payload;
      state.isLoadingDataPoint = false;
    },
    [getCountriesPoint.rejected]: (state, action) => {
      state.isLoadingDataPoint = false;
    }
  }
});

const { reducer, actions } = countriesSlice;

export { getCountries, getDataSummary, getCountriesPoint };
export const { setState } = actions;
export default reducer;