import { Signales } from "@dynamicabot/signales";

const mainLogger = new Signales({
  config: {
    displayBadge: true,
    displayLabel: true,
    displayScope: true,
  },
});

export default mainLogger;
