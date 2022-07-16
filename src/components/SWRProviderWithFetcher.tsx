import { fetcher } from "@hooks";
import loadable from "@loadable/component";

const SWRConfig = loadable(() => import("swr"), {
  resolveComponent: (components) => components.SWRConfig,
});

const SWRConfigWithFetcher: React.FC<{ children: any }> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (error) => {
          console.log("This is an error", error);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigWithFetcher;
