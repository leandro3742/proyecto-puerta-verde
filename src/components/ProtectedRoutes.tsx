import { Navigate, Outlet } from "react-router-dom"
import { verifyToken } from "../assets/utils"

const ProtectedRoutes = () => {
  if (verifyToken()) return <Outlet />
  else return <Navigate to="/menuProductos" />
}

export default ProtectedRoutes