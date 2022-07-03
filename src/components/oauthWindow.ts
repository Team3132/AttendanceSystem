import { ScopedMutator } from "swr/dist/types";

export function createOAuthWindow(url: string, mutate: ScopedMutator<any>) {
  const left = screen.width / 2 - 400;
  const top = screen.height / 2 - 350;
  const authWindow = window.open(
    url,
    "oauth window",
    "resizable=yes, width=800, height=700, top=" + top + ", left=" + left
  );
  if (authWindow) {
    authWindow.onbeforeunload = () => {
      mutate("/api/auth/status");
    };
  }
}
