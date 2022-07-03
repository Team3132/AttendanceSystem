import { Box, Grid, Paper } from "@mui/material";

const events = [];
const testarray = new Array(31);
export const CalendarGrid: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {testarray.length}
      <Grid container spacing={2} columns={7}>
        {testarray.map((val) => {
          return (
            <Grid item xs={1}>
              <Paper>xs=1</Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
