import axios from "axios";

const apibanks = axios.create({
  baseURL: "https://api.upcapitalpay.com/v1/customers/",

  timeout: 10000,
});

export default apibanks;
