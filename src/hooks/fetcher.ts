import axios, { Axios } from "axios";
import { BareFetcher } from "swr";

const api = axios.create({
  baseURL: "https://api.team3132.com",
  withCredentials: true,
});

export const fetcher: BareFetcher<any> = (url: string, params?: any) =>
  api.get(url, { params }).then((res) => res.data);
