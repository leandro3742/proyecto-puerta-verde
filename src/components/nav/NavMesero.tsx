import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, Button, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { meseroStore } from '../../state/mesero';
import { closeSession } from '../../assets/utils';
import { Link, useLocation } from 'react-router-dom';

const NavMesero = () => {
  // Obtener url
  const location = useLocation()
  console.log(location.pathname)
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
    <div className='d-flex align-items-center'>
      <div className='mx-3'>
        {location.pathname.includes('/mesero') ?
          <Link to='barra'><Button>Modo Barra</Button></Link>
          :
          <Link to='mesero'><Button>Modo Mesero</Button></Link>
        }

      </div>
      <div className='d-flex flex-column justify-content-center align-items-start'>
        <div className='mb-2 d-flex'>
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
          </Menu>
        </div>
        <div>
          <Button variant='contained' color='error' size='small' onClick={closeSession}>Cerrar sesion</Button>
        </div>
      </div>
    </div>
  )
}

export default NavMesero