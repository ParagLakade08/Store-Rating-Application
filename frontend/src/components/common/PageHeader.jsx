import { Box, Typography, Divider } from '@mui/material';

export default function PageHeader({ title, subtitle, action }) {
  return (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5">{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
