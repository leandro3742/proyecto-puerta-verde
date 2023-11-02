import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

const NavMesero = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [notifications, setNotifications] = useState(['Notificación 1', 'Notificación 2', 'Notificación 3']);
  const [cant, setCant] = useState(3);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setCant(0);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div>
      <Button variant="outlined" className='p-3' onClick={handleClick}>
        <Badge badgeContent={cant} color="secondary">
          <NotificationsNoneIcon />
        </Badge>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {notifications.map((notification, index) => (
          <MenuItem key={index}>{notification}</MenuItem>
        ))}
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  )
}

export default NavMesero