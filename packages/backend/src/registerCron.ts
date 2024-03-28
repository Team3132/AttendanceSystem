import { CronJob } from "cron";
import { syncEvents } from "./services/calalendarSync.service";

export function registerCron() {
  syncEvents();
  new CronJob("00 23 * * *", async () => { await syncEvents() }, null, null, "Australia/Sydney");
}
