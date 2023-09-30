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
        <nav>
          <Link to='/login'>
            <img src={logo} id='logo' />
          </Link>
        </nav>
        {children}
      </div>
    </main>
  )
}

export default Layout