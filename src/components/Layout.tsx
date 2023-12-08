import { ReactNode } from "react"
import { Link } from "react-router-dom"
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
import NavCocina from "./nav/NavCocina";
import { verifyToken } from "../assets/utils";
import { Button } from "@mui/material";

const Layout = ({ children }: { children: ReactNode }) => {
  const { showSpinner } = spinnerStore()

  const showNav = () => {
    if (localStorage.getItem('rol') === 'ADMIN') return <NavAdmin />
    if (localStorage.getItem('rol') === 'MOZO') return <NavMesero />
    if (localStorage.getItem('rol') === 'COCINA') return <NavCocina />
  }

  return (
    <main>
      {showSpinner && <Spinner />}
      <div className="bg" style={{ opacity: showSpinner ? .5 : 1 }}>
        <nav className="d-flex align-items-center justify-content-between">
          <Link to='/'>
            <img src={logo} id='logo' />
          </Link>
          <div className="d-flex">
            {showNav()}
          </div>
          {!verifyToken() &&
            <Link to='/login' className="btn">
              <Button variant="contained" color="primary">
                Iniciar sesión
              </Button>
            </Link>
          }
        </nav>
        {children}
      </div>
    </main>
  )
}

export default Layout