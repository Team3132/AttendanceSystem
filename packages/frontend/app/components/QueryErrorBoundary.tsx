import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type React from "react";
import { useCallback } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

interface CustomFallbackProps extends FallbackProps {
  handleBack: () => void;
}

interface QueryErrorBoundaryProps {
  fallbackRender: (props: CustomFallbackProps) => React.JSX.Element;
  children: React.ReactNode;
}

export default function QueryErrorBoundary(props: QueryErrorBoundaryProps) {
  const { children, fallbackRender } = props;

  const router = useRouter();

  const handleBack = useCallback(() => router.history.back(), [router]);

  const customFallbackRender = useCallback(
    (props: FallbackProps) => fallbackRender({ handleBack, ...props }),
    [fallbackRender, handleBack],
  );

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallbackRender={customFallbackRender}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
