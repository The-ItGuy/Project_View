import axios from "axios";

export const globalAxios = axios.create({
  baseURL: process.env["NEXT_PUBLIC_BACKEND_API_BASE"],
  headers: {
    // Global defaults
  },
});
