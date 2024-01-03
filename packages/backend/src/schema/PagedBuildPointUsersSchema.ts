import { BuildPointUserSchema } from "./BuildPointUserSchema";
import { PagedSchema } from "./PagedSchema";

export const PagedBuildPointsSchema = PagedSchema(BuildPointUserSchema);
