import { useToast } from "@chakra-ui/react";
import { useRegisterSW } from "virtual:pwa-register/react";

export const SWToast: React.FC = () => {
  const toast = useToast();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onOfflineReady: () => {
      toast({ description: "This site now works offline.", duration: 10000 });
    },
  });
  return null;
};
export default SWToast;
