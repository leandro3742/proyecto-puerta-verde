import { useNavigate } from "react-router-dom"
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
  const navigate = useNavigate()

  const handleChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    changeState()
    const data = new FormData(e.currentTarget);
    if (!data.get('usuario') || !data.get('password')) {
      enqueueSnackbar('Los campos no deben estar vacíos', { variant: 'error' })
      changeState()
      return
    }
    try {
      const response = await login({ username: data.get('usuario') as string, password: data.get('password') as string })
      changeState()
      enqueueSnackbar('Bienvenido, ' + response.loginRespponse.nombre, { variant: 'success' })
      const tokenExpirationTime = new Date(new Date().getTime() + 12 * 3600 * 1000);
      localStorage.setItem('token', response.loginRespponse.token)
      localStorage.setItem('tokenExpirationTime', tokenExpirationTime.toISOString())
      if (response.roles.find((rol: any) => rol.nombre === 'ADMIN')) {
        localStorage.setItem('rol', 'ADMIN')
        navigate('/admin/estadisticas')
      }
      else if (response.roles.find((rol: any) => rol.nombre === 'CAJA')) {
        localStorage.setItem('rol', 'CAJA')
        navigate('/caja')
      }
      else if (response.roles.find((rol: any) => rol.nombre === 'COCINA')) {
        localStorage.setItem('rol', 'COCINA')
        navigate('/cocina')
      }
      else if (response.roles.find((rol: any) => rol.nombre === 'BARRA')) {
        localStorage.setItem('rol', 'BARRA')
        navigate('/barra')
      }
      else if (response.roles.find((rol: any) => rol.nombre === 'MESERO')) {
        localStorage.setItem('rol', 'MESERO')
        navigate('/mesero')
      }
    } catch (err) {
      changeState()
      enqueueSnackbar('Usuario y/o contraseña incorrectos', { variant: 'error' })
    }
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