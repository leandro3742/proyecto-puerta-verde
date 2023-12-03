import { Button, Fade, Menu, MenuItem } from "@mui/material"
import { useState } from "react";
import { Link } from "react-router-dom"
import { closeSession } from "../../assets/utils";

const NavAdmin = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElDesktop, setAnchorElDesktop] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openDesktop = Boolean(anchorElDesktop);
  const handleClickDesktop = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElDesktop(event.currentTarget);
  };

  const handleCloseDesktop = () => {
    setAnchorElDesktop(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {window.screen.width > 768 &&
        <section className="d-flex">
          <Link className="mx-3 text-white" to='/mesero'>
            <h5 className=''>Mesero</h5>
          </Link>
          <Link className="mx-3 text-white" to='/cocina'>
            <h5 className=''>Cocina</h5>
          </Link>
          <Link className="mx-3 text-white" to='/barra'>
            <h5 className=''>Barra</h5>
          </Link>
          <Link className="mx-3 text-white" to='/caja'>
            <h5 className=''>Cajero</h5>
          </Link>
          <Button
            aria-controls={openDesktop ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openDesktop ? 'true' : undefined}
            onClick={handleClickDesktop}
            variant="outlined"
          >
            Admin
          </Button>
          <Menu
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorElDesktop}
            open={openDesktop}
            onClose={handleCloseDesktop}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleCloseDesktop}>
              <Link className="text-white" to='/admin/clientes'>
                Cliente
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseDesktop}>
              <Link className="text-white" to='/admin/ingredientes'>
                Ingredientes
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseDesktop}>
              <Link className="text-white" to='/admin/productos'>
                Productos
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseDesktop}>
              <Link className="text-white" to='/admin/mesas'>
                Mesas
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseDesktop}>
              <Link className="text-white" to='/admin/usuarios'>
                Usuarios
              </Link>
            </MenuItem>
            <MenuItem onClick={handleCloseDesktop}>
              <Link className="text-white" to='/admin/estadisticas'>
                Estadisticas
              </Link>
            </MenuItem>
            <Button color="error" onClick={closeSession}>
              Cerrar Sesión
            </Button>
          </Menu>
        </section>
      }
      {
        window.screen.width <= 768 &&
        <>
          <Button
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            Menu
          </Button>
          <Menu
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleClose}>
              <Link className="text-white" to='/mesero'>
                Mesero
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link className="text-white" to='/cocina'>
                Cocina
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link className="text-white" to='/barra'>
                Barra
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link className="text-white" to='/caja'>
                Cajero
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link className="text-white" to='/admin'>
                Admin
              </Link>
            </MenuItem>
            <MenuItem onClick={closeSession}>Logout</MenuItem>
          </Menu>
        </>
      }
    </>
  )
}

export default NavAdmin