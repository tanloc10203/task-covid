import axios from "axios";
import queryString from "query-string";

const BASE_URL = process.env.REACT_APP_API_URL || "https://disease.sh/v3/covid-19/";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

instance.interceptors.request.use(
  response => {
    if (response && response.data)
      return response.data;
    return response;
  },
  err => Promise.reject(err)
)

export default instance;