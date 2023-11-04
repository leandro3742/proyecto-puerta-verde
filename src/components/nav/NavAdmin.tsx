import { Button, Fade, Menu, MenuItem } from "@mui/material"
import { useState } from "react";
import { Link } from "react-router-dom"

const NavAdmin = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
          <Link className="mx-3 text-white" to='/admin'>
            <h5 className=''>Admin</h5>
          </Link>
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
              <Link className="mx-3 text-white" to='/caja'>
                <h5 className=''>Cajero</h5>
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link className="text-white" to='/admin'>
                Admin
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </>
      }
    </>
  )
}

export default NavAdmin