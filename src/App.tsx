import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { ThemeConfig } from './theme.config'
import * as signalR from '@microsoft/signalr'
import { BACKEND_URL } from './assets/constant'

import { cocinaStore } from './state/cocina'
import Layout from './components/Layout'
import Login from './views/Login'
import Cliente from './views/admin/Cliente'
import AdminHome from './views/admin/AdminHome'
import ProtectedRoutes from './components/ProtectedRoutes'
import Cocina from './views/cocina/Cocina'
import Barra from './views/barra/Barra'
import Ingrediente from './views/admin/Ingrediente'
import Producto from './views/admin/Producto'
import Caja from './views/caja/Caja'
import Mesas from './views/admin/Mesas'
import Usuarios from './views/admin/Usuarios'
import Graphics from './components/Graphics'
import { meseroStore } from './state/mesero'
import CerrarCaja from './views/caja/CerrarCaja'
import Menu from './views/mesero/Menu'
import Mesero from './views/mesero/Mesero'

function App() {
  const { addNotification } = cocinaStore()
  const { addNotification: addNotificationMesero } = meseroStore()
  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(BACKEND_URL + "chatHub", { withCredentials: true })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    hubConnection.start()
      .then(() => {
        console.log("Conexión SignalR establecida");
      })
      .catch(error => {
        console.error(error);
      });

    hubConnection.on("NewPedido", (message) => {
      addNotification(message);
    })

    hubConnection.on("ClosePedido", (message) => {
      addNotificationMesero({ message, read: false })
    })
  }, []);

  return (
    <BrowserRouter>
      <SnackbarProvider maxSnack={2}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ThemeConfig>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path='/' element={<ProtectedRoutes />}>
                <Route index element={<div>
                </div>} />
                <Route path='mesero' element={<Mesero />} />
                <Route path='mesero/:mesa/:precioTotal' element={<Menu />} />
              </Route>

              <Route path='/cocina' element={<ProtectedRoutes />}>
                <Route index element={<Cocina />} />
              </Route>

              <Route path='/barra' element={<ProtectedRoutes />}>
                <Route index element={<Barra />} />
              </Route>

              <Route path='/admin' element={<ProtectedRoutes />} >
                <Route index element={<AdminHome />} />
                {/* AGREGAR LAS RUTAS ACA */}
                <Route path='clientes' element={<Cliente />} />
                <Route path='ingredientes' element={<Ingrediente />} />
                <Route path='productos' element={<Producto />} />
                <Route path='mesas' element={<Mesas />} />
                <Route path='usuarios' element={<Usuarios />} />
                <Route path='estadisticas' element={<Graphics />} />
              </Route>

              <Route path='/caja' element={<ProtectedRoutes />}>
                <Route index element={<Caja />} />
                <Route path=':mesa/:precioTotal' element={<CerrarCaja />} />
              </Route>

            </Routes>
          </Layout>
        </ThemeConfig>
      </ SnackbarProvider>
    </BrowserRouter>
  )
}

export default App
