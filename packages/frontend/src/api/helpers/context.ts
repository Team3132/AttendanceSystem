import { getContext as getAsyncContext } from "hono/context-storage";
import { HonoEnv } from "../hono";

export const getContext = () => getAsyncContext<HonoEnv>();
