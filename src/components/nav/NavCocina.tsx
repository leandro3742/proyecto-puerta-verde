import { Button } from '@mui/material';
import { closeSession } from '../../assets/utils';

const NavCocina = () => {

  return (
    <div>
      <Button variant='contained' color='error' onClick={closeSession}>Cerrar sesion</Button>
    </div>
  )
}

export default NavCocina