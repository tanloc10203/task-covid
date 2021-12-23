import axios from "./axios";

const countriesApi = {
  getCountries() {
    return axios.get("/countries");
  },
  getReportByCountry(country) {
    return axios.get(`/countries/${country}?twoDaysAgo=1&yesterday=1`);
  },
  getCountriesPoint() {
    return axios.get("/jhucsse");
  },
  getDadaCountryByDay(country, dayInput) {
    const day = dayInput && dayInput.getState() ? dayInput.getState().country.day : 30;
    return axios.get(`/historical/${country}?lastdays=${day}`);
  }
}

export default countriesApi;