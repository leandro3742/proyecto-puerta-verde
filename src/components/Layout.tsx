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

const Layout = ({ children }: { children: ReactNode }) => {
  const { showSpinner } = spinnerStore()

  return (
    <main>
      {showSpinner && <Spinner />}
      <div className="bg" style={{ opacity: showSpinner ? .5 : 1 }}>
        <nav className="d-flex align-items-center justify-content-between">
          <Link to='/login'>
            <img src={logo} id='logo' />
          </Link>

          {/*<section className="d-flex">
            <Link className="mx-3 text-white" to='/mesero'>
              <h5 className=''>Mesero</h5>
            </Link>
            <Link className="mx-3 text-white" to='/cocina'>
              <h5 className=''>Cocina</h5>
            </Link>
            <Link className="mx-3 text-white" to='/barra'>
              <h5 className=''>Barra</h5>
            </Link>
            <Link className="mx-3 text-white" to='/admin'>
              <h5 className=''>Admin</h5>
            </Link>
  </section>*/}
        </nav>
        {children}
      </div>
    </main>
  )
}

export default Layout