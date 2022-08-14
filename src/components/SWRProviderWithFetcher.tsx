import loadable from "@loadable/component";
import { fetcher } from "../hooks";

const SWRConfig = loadable(() => import("swr"), {
  resolveComponent: (components) => components.SWRConfig,
});

function localStorageProvider() {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem("app-cache") || "[]"));
  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });

  // We still use the map for write & read for performance.
  return map;
}

const SWRConfigWithFetcher: React.FC<{ children: any }> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error) => {
          console.log("This is an error", error);
        },
        provider: localStorageProvider,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigWithFetcher;
