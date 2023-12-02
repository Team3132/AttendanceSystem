import { z } from "zod";
import { t } from "../trpc";
import { tokenProcedure } from "../trpc/utils";

/**
 * A router than the bot uses to communicate with the backend
 */
const botRouter = t.router({
    online: tokenProcedure.input(z.void()).query(() => {
        return "OK" as const;
    })
})

export default botRouter;