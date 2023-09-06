import { ReactNode } from "react"
import { Link } from "react-router-dom"
// Bootstrap
import "bootstrap/dist/css/bootstrap.css";
// Styles
import '../styles/global.css'
import '../styles/layout.css'
// Assets
import logo from '../assets/logo.png'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <nav>
        <Link to='/login'>
          <img src={logo} id='logo' />
        </Link>
      </nav>
      {children}
    </main>
  )
}

export default Layout