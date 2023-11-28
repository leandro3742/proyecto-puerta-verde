import { ReactNode, useEffect } from "react"
import { Link, redirect } from "react-router-dom"
// Bootstrap
import "bootstrap/dist/css/bootstrap.css";
// Styles
import '../styles/global.css'
import '../styles/layout.css'
// Assets
import logo from '../assets/logo.png'
import Spinner from "./Spinner";
import spinnerStore from "../state/spinner";
import NavMesero from "./nav/NavMesero";
import NavAdmin from "./nav/NavAdmin";
// import { Button } from "@mui/material";

const Layout = ({ children }: { children: ReactNode }) => {
  let type = 'admin'
  const { showSpinner } = spinnerStore()
  useEffect(() => {
    if (!localStorage.getItem('token')) redirect('/login')
  }, [])


  return (
    <main>
      {showSpinner && <Spinner />}
      <div className="bg" style={{ opacity: showSpinner ? .5 : 1 }}>
        <nav className="d-flex align-items-center justify-content-between">
          <Link to='/login'>
            <img src={logo} id='logo' />
          </Link>
          <div className="d-flex">
            {type === 'mesero' && <NavMesero />}
            {type === 'admin' && <NavAdmin />}

            {/* <Button className="ms-3" variant="contained" color="error" onClick={() => {
              localStorage.removeItem('token')
              redirect('/login')
            }}>Cerrar sesion</Button> */}
          </div>
        </nav>
        {children}
      </div>
    </main>
  )
}

export default Layout