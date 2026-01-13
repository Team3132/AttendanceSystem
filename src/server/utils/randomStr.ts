import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";

export const randomStr = customAlphabet(alphanumeric, 8);
