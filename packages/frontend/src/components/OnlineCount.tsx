import { queryUtils, trpc } from "@/trpcClient";

export default function OnlineCountComponent() {
  const onlineCount = trpc.frontendOnline.useQuery();

  trpc.frontendOnlineSubscription.useSubscription(undefined, {
    onData: (count) => {
      queryUtils.frontendOnline.setData(undefined, count);
    },
  });

  return (
    <div>
      <h1>Online count: {onlineCount.data}</h1>
    </div>
  );
}
