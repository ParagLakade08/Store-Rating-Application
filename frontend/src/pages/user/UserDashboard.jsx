import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon  from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import PageHeader      from '../../components/common/PageHeader';
import { useAuth }     from '../../context/AuthContext';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const navigate        = useNavigate();

  return (
    <DashboardLayout title="Dashboard">
      <PageHeader
        title={`Welcome, ${currentUser?.name?.split(' ')[0]}!`}
        subtitle="Browse stores and submit your ratings"
      />
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={3} maxWidth={600}>
        <Card sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)' } }}
          onClick={() => navigate('/user/stores')}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <StoreIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Browse Stores</Typography>
            <Typography variant="body2" color="text.secondary">Discover and rate local stores</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/user/stores')}>View Stores</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <StarIcon sx={{ fontSize: 48, color: '#f57c00', mb: 1 }} />
            <Typography variant="h6" gutterBottom>Rate Stores</Typography>
            <Typography variant="body2" color="text.secondary">Share your experience (1–5 stars)</Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/user/stores')}>Rate Now</Button>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
