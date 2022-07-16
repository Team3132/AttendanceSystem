import axios from "axios";
import { BareFetcher } from "swr";

export const fetcher: BareFetcher<any> = (url: string) =>
  axios(url).then((res) => res.data);
export default fetcher;
