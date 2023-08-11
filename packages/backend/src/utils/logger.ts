import { Signale } from '@dynamicabot/signales';

const mainLogger = new Signale({
  config: {
    displayTimestamp: true,
    displayBadge: true,
    displayLabel: true,
  },
});

export default mainLogger;
