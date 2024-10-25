import axios from "axios";

const apibanks = axios.create({
  baseURL: "https://api.acobank.com.br/v1/",
  timeout: 10000,
});

export default apibanks;
