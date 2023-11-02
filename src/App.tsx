import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { ThemeConfig } from './theme.config'
import * as signalR from '@microsoft/signalr'
import { BACKEND_URL } from './assets/constant'

import { cocinaStore } from './state/cocina'
import Layout from './components/Layout'
import Login from './views/Login'
import Mesa from './views/Mesa'
import Cliente from './views/admin/Cliente'
import AdminHome from './views/admin/AdminHome'
import ProtectedRoutes from './components/ProtectedRoutes'
import Cocina from './views/cocina/Cocina'
import Barra from './views/barra/Barra'
import Ingrediente from './views/admin/Ingrediente'
import Producto from './views/admin/Producto'
import Caja from './views/caja/Caja'
import ListMesas from './views/ListMesas'
import Graphics from './components/graphics'

function App() {
  const { addNotification } = cocinaStore()

  // useEffect(() => {
  //   const hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(BACKEND_URL + "chatHub", { withCredentials: true })
  //     .configureLogging(signalR.LogLevel.Information)
  //     .build();

  //   hubConnection.start()
  //     .then(() => {
  //       console.log("Conexión SignalR establecida");
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });

  //   hubConnection.on("ReceiveMessage", (user, message) => {
  //     console.log(user + " dice: " + message);
  //   })

  //   hubConnection.on("NewPedido", (message) => {
  //     addNotification(message);
  //     console.log(message);
  //   })

  //   hubConnection.on("PedidoCerrado", (message) => {
  //     addNotification(message);
  //     console.log(message);
  //   })
  // }, []);

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
                  <Graphics />
                </div>} />
                <Route path='mesero' element={<ListMesas url={'mesero'} />} />
                <Route path='mesero/:mesa/:precioTotal' element={<Mesa />} />
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
              </Route>

              <Route path='/caja' element={<ProtectedRoutes />}>
                <Route index element={<ListMesas url='caja' />} />
                <Route path=':mesa/:precioTotal' element={<Caja />} />
              </Route>

            </Routes>
          </Layout>
        </ThemeConfig>
      </ SnackbarProvider>
    </BrowserRouter>
  )
}

export default App
