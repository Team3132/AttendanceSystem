import { Avatar } from "@mui/material";
import { FaCheck, FaClock, FaQuestion, FaXmark } from "react-icons/fa6";

interface StatusAvatarProps {
  status: "LATE" | "MAYBE" | "NO" | "YES" | "ATTENDED" | null;
}

export default function StatusAvatar({ status }: StatusAvatarProps) {
  return (
    <Avatar
      sx={{
        bgcolor:
          status === "YES" || status === "ATTENDED"
            ? "success.main"
            : status === "NO"
              ? "error.main"
              : status === "LATE"
                ? "warning.main"
                : undefined,
      }}
    >
      {status === null ? (
        ""
      ) : status === "YES" || status === "ATTENDED" ? (
        <FaCheck />
      ) : status === "NO" ? (
        <FaXmark />
      ) : status === "LATE" ? (
        <FaClock />
      ) : (
        <FaQuestion />
      )}
    </Avatar>
  );
}
