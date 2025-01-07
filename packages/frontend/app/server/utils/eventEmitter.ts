import { EventEmitter } from "eventemitter3";
import type { EventTypes } from "../queryKeys";

const ee = new EventEmitter<EventTypes>();

export default ee;
