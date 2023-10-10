import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './componetns/Layout'
import Login from './views/Login'
import { ThemeConfig } from './theme.config'
import { SnackbarProvider } from 'notistack'
import Mesero from './views/Mesero'
import Mesa from './views/Mesa'
import Cliente from './views/Cliente'
import { useEffect } from 'react'
import * as signalR from '@microsoft/signalr'

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
              <Route path="/" element={<div>Home</div>} />
              <Route path="/login" element={<Login />} />
              <Route path='/mesero' element={<Mesero />} />
              <Route path='mesero/:mesa' element={<Mesa />} />
              <Route path='/cliente' element={<Cliente />} />
            </Routes>
          </Layout>
        </ThemeConfig>
      </ SnackbarProvider>
    </BrowserRouter>
  )
}

export default App
