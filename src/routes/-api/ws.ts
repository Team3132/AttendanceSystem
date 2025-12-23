import { Hono } from "hono";
import type { HonoEnv } from "../api.$";

export const wsRoute = new Hono<HonoEnv>().get(
  "",
  // upgradeWebSocket((_c: Context<HonoEnv>) => {
  //   return {
  //     onMessage(event, ws) {
  //       console.log(`Message from client: ${event.data}`);
  //       ws.send("Hello from server!");
  //     },
  //     onClose: () => {
  //       console.log("Connection closed");
  //     },
  //     onOpen: async () => {
  //       console.log("subscribed");
  //       // for await (const update of c.var.pubSub.subscribe(
  //       //   "event:rsvpUpdated",
  //       //   "",
  //       // )) {
  //       //   ws.send(update.toString());
  //       // }
  //     },
  //   };
  // }),
);
