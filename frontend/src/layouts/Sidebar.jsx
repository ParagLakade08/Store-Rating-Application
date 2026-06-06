import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Divider, Avatar, Chip,
} from '@mui/material';
import DashboardIcon  from '@mui/icons-material/Dashboard';
import PeopleIcon     from '@mui/icons-material/People';
import StoreIcon      from '@mui/icons-material/Store';
import StarIcon       from '@mui/icons-material/Star';
import LockIcon       from '@mui/icons-material/Lock';
import { useAuth }    from '../context/AuthContext';

export const DRAWER_WIDTH = 240;

const NAV = {
  ADMIN: [
    { label: 'Dashboard',  path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Users',      path: '/admin/users',     icon: <PeopleIcon />    },
    { label: 'Stores',     path: '/admin/stores',    icon: <StoreIcon />     },
    { label: 'Change Password', path: '/change-password', icon: <LockIcon /> },
  ],
  USER: [
    { label: 'Dashboard',  path: '/user/dashboard',  icon: <DashboardIcon /> },
    { label: 'Stores',     path: '/user/stores',     icon: <StoreIcon />     },
    { label: 'Change Password', path: '/change-password', icon: <LockIcon /> },
  ],
  STORE_OWNER: [
    { label: 'Dashboard',  path: '/owner/dashboard', icon: <DashboardIcon /> },
    { label: 'Change Password', path: '/change-password', icon: <LockIcon /> },
  ],
};

const ROLE_COLOR = { ADMIN: '#e53935', USER: '#1976d2', STORE_OWNER: '#388e3c' };

export default function Sidebar({ mobileOpen, onClose }) {
  const { currentUser } = useAuth();
  const navigate        = useNavigate();
  const { pathname }    = useLocation();

  const items = NAV[currentUser?.role] || [];

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1a2236', color: '#fff' }}>
      <Toolbar sx={{ px: 2 }}>
        <StarIcon sx={{ color: '#90caf9', mr: 1 }} />
        <Typography variant="h6" sx={{ color: '#90caf9', fontWeight: 700, fontSize: 15 }}>
          Store Rating
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {currentUser && (
        <Box sx={{ px: 2, py: 2 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ width: 38, height: 38, bgcolor: '#1976d2', fontSize: 14 }}>
              {currentUser.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box minWidth={0}>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, lineHeight: 1.3 }} noWrap>
                {currentUser.name}
              </Typography>
              <Chip
                label={currentUser.role}
                size="small"
                sx={{ height: 18, fontSize: 10, bgcolor: ROLE_COLOR[currentUser.role], color: '#fff', mt: 0.3 }}
              />
            </Box>
          </Box>
        </Box>
      )}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      <List sx={{ px: 1, pt: 1, flexGrow: 1 }}>
        {items.map((item) => {
          const active = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <ListItemButton
              key={item.path}
              onClick={() => { navigate(item.path); onClose?.(); }}
              sx={{
                borderRadius: 2, mb: 0.5,
                bgcolor: active ? 'rgba(144,202,249,0.18)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(144,202,249,0.1)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? '#90caf9' : 'rgba(255,255,255,0.55)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#90caf9' : 'rgba(255,255,255,0.75)',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
      {/* Mobile */}
      <Drawer
        variant="temporary" open={mobileOpen} onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
      >
        {content}
      </Drawer>
      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        open
      >
        {content}
      </Drawer>
    </Box>
  );
}
