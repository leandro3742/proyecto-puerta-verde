import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, Button, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { meseroStore } from '../../state/mesero';
// import DeleteIcon from '@mui/icons-material/Delete';
const NavMesero = () => {
  const { notifications, readNotification } = meseroStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [cant, setCant] = useState<number>(0);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    readNotification();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setCant(notifications.filter((notification) => !notification.read).length)
  }, [notifications])

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

        {/* {notifications.length > 0 && <Button color='error'><DeleteIcon /></Button>} */}
      </Menu>
    </div>
  )
}

export default NavMesero