import { EventEmitter } from "eventemitter3";
import type { StrictlyTypedQueryKeys } from "../queryKeys";

interface EventTypes {
  invalidate: [StrictlyTypedQueryKeys];
}

const ee = new EventEmitter<EventTypes>();

export default ee;
