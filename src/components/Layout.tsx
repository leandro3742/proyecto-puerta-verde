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

const Layout = ({ children }: { children: ReactNode }) => {
  let type = 'admin'
  const { showSpinner } = spinnerStore()
  return (
    <main>
      {showSpinner && <Spinner />}
      <div className="bg" style={{ opacity: showSpinner ? .5 : 1 }}>
        <nav className="d-flex align-items-center justify-content-between">
          <Link to='/login'>
            <img src={logo} id='logo' />
          </Link>
          <>
            {type === 'mesero' && <NavMesero />}
            {type === 'admin' && <NavAdmin />}
          </>
        </nav>
        {children}
      </div>
    </main>
  )
}

export default Layout