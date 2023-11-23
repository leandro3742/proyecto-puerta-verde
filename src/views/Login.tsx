import { redirect, useNavigate } from "react-router-dom"
import { useSnackbar } from "notistack"
// Styles
import '../styles/login.css'
// Material UI
import { Button, Paper, TextField } from "@mui/material"
import { login } from "../api/login"
import spinnerStore from "../state/spinner"

const Login = () => {
  const { changeState } = spinnerStore()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate();

  const handleChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    changeState()
    const data = new FormData(e.currentTarget);
    if (!data.get('usuario') || !data.get('password')) {
      enqueueSnackbar('Los campos no deben estar vacíos', { variant: 'error' })
      changeState()
      return
    }
    login({ username: data.get('usuario') as string, password: data.get('password') as string })
      .then(response => {
        enqueueSnackbar('Bienvenido, ' + response.nombre, { variant: 'success' })
        localStorage.setItem('token', response.token)
        return navigate('/mesero')
      })
      .catch(() => {
        enqueueSnackbar('Usuario y/o contraseña incorrectos', { variant: 'error' })
      })
      .finally(() => {
        changeState()
      })
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