import { configureStore } from "@reduxjs/toolkit";
import countriesReducer from "./slices/CountriesSlice";
import countryReducer from "./slices/CountrySlice";

const rootRenderer = {
  countries: countriesReducer,
  country: countryReducer
};

const store = configureStore({
  reducer: rootRenderer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;