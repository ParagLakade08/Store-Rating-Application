import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip, Avatar } from '@mui/material';
import MenuIcon     from '@mui/icons-material/Menu';
import LogoutIcon   from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth }  from '../context/AuthContext';
import { DRAWER_WIDTH } from './Sidebar';

export default function Navbar({ title, onMenuClick }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml:    { sm: `${DRAWER_WIDTH}px` },
        bgcolor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        color: 'text.primary',
      }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 2, display: { sm: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: '#1a2236' }}>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2', fontSize: 13 }}>
            {currentUser?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
            {currentUser?.name}
          </Typography>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} size="small">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
