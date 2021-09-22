// This not working in my case so I will prefer to create config.env

import axios from "axios";

const instance = axios.create({
  baseUrl: "http://localhost:3000",
});

export default instance;
