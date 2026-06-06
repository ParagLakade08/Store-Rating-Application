import { Card, CardContent, Box, Typography } from '@mui/material';

export default function StatCard({ label, value, icon, color = '#e3f2fd', iconColor = '#1976d2' }) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
            <Typography variant="h4" fontWeight={700}>{value ?? '—'}</Typography>
          </Box>
          <Box sx={{ bgcolor: color, borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ color: iconColor, display: 'flex' }}>{icon}</Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
