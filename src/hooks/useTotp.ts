import { authenticator } from "@/utils/otp";
import { useState, useEffect } from "react";

/**
 *
 * Hook that returns the time remaining and time spent and the token itself react state
 */
export default function useTotp(secret: string) {
  const [token, setToken] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let interval: number;

    // start the interval precisely at the beginning of the next second
    const now = new Date();
    const delay = 1000 - now.getMilliseconds();
    setTimeout(() => {
      interval = setInterval(() => {
        const token = authenticator.generate(secret);
        const timeRemaining = authenticator.timeRemaining();
        const timeSpent = authenticator.timeUsed();

        setToken(token);
        setIsLoading(false);

        setTimeRemaining(timeRemaining);
        setTimeSpent(timeSpent);
      }, 1000);
    }, delay);

    return () => clearInterval(interval);
  }, [secret]);

  return { token, timeRemaining, timeSpent, isLoading };
}
