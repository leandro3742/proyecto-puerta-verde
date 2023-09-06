import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './componetns/Layout'
import Login from './views/Login'
import { ThemeConfig } from './theme.config'
import { SnackbarProvider } from 'notistack'
import Mesero from './views/Mesero'
import Mesa from './views/Mesa'

function App() {

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
            </Routes>
          </Layout>
        </ThemeConfig>
      </ SnackbarProvider>
    </BrowserRouter>
  )
}

export default App
