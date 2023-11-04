import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { meseroStore } from '../../state/mesero';

const NavMesero = () => {
  const { notifications } = meseroStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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
          <MenuItem key={index}>{notification.message}</MenuItem>
        ))}
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  )
}

export default NavMesero