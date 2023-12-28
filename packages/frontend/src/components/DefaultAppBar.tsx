import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { FaCircleUser } from "react-icons/fa6";
import LinkBehavior from "../utils/LinkBehavior";
import { Helmet } from "react-helmet-async";

interface DefaultAppBarProps {
  title: string;
}

export default function DefaultAppBar({ title }: DefaultAppBarProps) {
  return (
    <>
      <Helmet>
        <title>{`${title} - Attendance System`}</title>
      </Helmet>
      <AppBar
        position="absolute"
        sx={{
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton LinkComponent={LinkBehavior} href="/profile">
            <FaCircleUser />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
