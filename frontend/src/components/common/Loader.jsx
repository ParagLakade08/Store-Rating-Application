import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loader({ message = 'Loading…' }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} gap={2}>
      <CircularProgress />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
