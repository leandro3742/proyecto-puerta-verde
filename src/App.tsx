import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './componetns/Layout'
import Login from './views/Login'
import { ThemeConfig } from './theme.config'
import { SnackbarProvider } from 'notistack'
import Mesero from './views/Mesero'
import Mesa from './views/Mesa'
import { useEffect } from 'react'
import * as signalR from '@microsoft/signalr'
import AdminHome from './views/admin/AdminHome'
import ProtectedRoutes from './componetns/ProtectedRoutes'

function App() {

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:32768/chatHub", { withCredentials: true })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    hubConnection.start()
      .then(() => {
        console.log("Conexión SignalR establecida");
      })
      .catch(error => {
        console.error(error);
      });

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
                <Route index element={<div>Home</div>} />
                <Route path='mesero' element={<Mesero />} />
                <Route path='mesero/:mesa' element={<Mesa />} />
              </Route>

              <Route path='/admin' element={<ProtectedRoutes />} >
                <Route index element={<AdminHome />} />
                <Route path='productos' element={<div>Productos</div>} />
                {/* AGREGAR LAS RUTAS ACA */}
              </Route>

            </Routes>
          </Layout>
        </ThemeConfig>
      </ SnackbarProvider>
    </BrowserRouter>
  )
}

export default App
