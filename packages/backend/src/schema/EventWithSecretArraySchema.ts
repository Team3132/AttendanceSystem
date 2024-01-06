import { z } from "zod";
import { EventWithSecretSchema } from "./EventWithSecretSchema";

export const EventWithSecretArraySchema = z.array(EventWithSecretSchema);
