import loadable from "@loadable/component";

export const ScancodePage = loadable(() => import("./pages/ScancodePage"));

export const ScancodeInput = loadable(
  () => import("./components/ScancodeInput"),
);
