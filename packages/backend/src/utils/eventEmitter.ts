import { EventEmitter } from "eventemitter3";
type QueryKey = ReadonlyArray<unknown>;

interface EventTypes {
  invalidate: [QueryKey];
}

const ee = new EventEmitter<EventTypes>();

export default ee;
