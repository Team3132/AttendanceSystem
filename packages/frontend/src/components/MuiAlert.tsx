import { Alert } from "@mui/material";
import type { AlertTemplateProps } from "react-alert";

export const MuiAlert: React.FC<AlertTemplateProps> = ({
  options,
  style,
  message,
  close,
}: AlertTemplateProps) => {
  return (
    <Alert severity={options.type} style={style} onClose={close}>
      {message}
    </Alert>
  );
};

export default MuiAlert;
