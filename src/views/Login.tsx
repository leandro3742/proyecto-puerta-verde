import { useNavigate } from "react-router-dom"
import { useSnackbar } from "notistack"
// Styles
import '../styles/login.css'
// Material UI
import { Button, Paper, TextField } from "@mui/material"

const Login = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate();

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget);
    console.log(data.get('usuario'))
    console.log(data.get('password'))
    enqueueSnackbar('Hola', { variant: 'success' })
    navigate('/mesero')
  }

  return (
    <div className="d-flex justify-content-center">
      <Paper className="login-box d-flex flex-column justify-content-around">
        <h1 className="text-center">Iniciar sesion</h1>
        <form className="d-flex flex-column" onSubmit={handleChange}>
          <TextField label="Usuario" name="usuario" />
          <TextField label="Password" name="password" className="mt-4" type='password' />
          <Button className="mt-4" type="submit">Iniciar sesion</Button>
        </form>
      </Paper>
    </div>
  )
}

export default Login