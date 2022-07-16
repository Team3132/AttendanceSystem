import axios from "axios";
import { BareFetcher } from "swr";

export const fetcher: BareFetcher<any> = (url: string, params?: any) =>
  axios.get(url, { params }).then((res) => res.data);
