import { Button, ButtonProps } from "@mui/material";
import { forwardRef } from "react";
import { useRemoveBuildPoint } from "../hooks/useRemoveBuildPoint";

interface RemoveBuildPointButtonProps extends ButtonProps {
  buildPointId: string;
}

// forward ref
export const RemoveBuildPointButton = forwardRef<
  HTMLButtonElement,
  RemoveBuildPointButtonProps
>(function RemoveBuildPointButton({ buildPointId, ...props }, ref) {
  const mutation = useRemoveBuildPoint();

  const handleClick = () => {
    mutation.mutate({ buildPointId });
  };

  return (
    <Button {...props} ref={ref} onClick={handleClick}>
      Remove
    </Button>
  );
});
