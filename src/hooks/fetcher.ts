import axios from "axios";

export const fetcher = (url: string) => axios(url).then((res) => res.data);
