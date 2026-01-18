import z from "zod";

export const RSVPStatusSchema = z.enum([
  "LATE",
  "MAYBE",
  "NO",
  "YES",
  "ATTENDED",
]);

// Omit attended status from the schema
export const RSVPStatusUpdateSchema = RSVPStatusSchema.exclude(["ATTENDED"]);
