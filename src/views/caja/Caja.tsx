import { Button } from "@mui/material"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
// Styles
import '../../styles/caja.css'
import { cerrarCuentaMesa, modificarMesa } from "../../api/mesa"
import spinnerStore from "../../state/spinner"
import { enqueueSnackbar } from "notistack"
const Caja = () => {
  const { mesa, precioTotal } = useParams()
  const [parcial, setParcial] = useState<string>('0')
  const { changeState } = spinnerStore()
  const navigate = useNavigate()
  useEffect(() => {
    console.log(mesa)
    console.log(precioTotal)
  }, [])

  const agregarPagoParcial = () => {
    const totalAux: number = parseInt(precioTotal ? precioTotal : '0')
    const totalParcial: number = parseInt(parcial ? parcial : '0')
    changeState()
    modificarMesa({
      id: parseInt(mesa ? mesa : '0'),
      precioTotal: totalAux - totalParcial
    })
      .then(() => {
        enqueueSnackbar('Pago parcial agregado', { variant: 'success' })
        navigate(-1)
      })
      .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
      .finally(() => changeState())
  }

  const cerrarMesa = () => {
    changeState()
    cerrarCuentaMesa(parseInt(mesa ? mesa : '0'))
      .then(() => {
        enqueueSnackbar('Mesa cerrada', { variant: 'success' })
        navigate(-1)
      })
      .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
      .finally(() => changeState())
  }

  return (
    <div>
      <div className="d-flex  justify-content-between p-2">
        <Link to='/caja'><Button>Volver</Button></Link>
      </div>

      <main className="d-flex align-items-center justify-content-center">
        <div className="caja-card p-3">
          <section>
            <h1>Pedido mesa {mesa}</h1>
          </section>
          <section className="my-3 d-flex justify-content-end">
            <Button>Listar productos</Button>
          </section>
          <section>
            <h5>Total: ${precioTotal}</h5>
            <div className="pago-parcial d-flex aling-items-center">
              <h5 className="m-0 p-0 text-center">Pago parcial: $</h5>
              <input type="number" value={parcial ? parseInt(parcial) : 0} onChange={(e) => setParcial(e.target.value)} />
            </div>
            <h5>Resto: ${parseInt(precioTotal ? precioTotal : '0') - parseInt(parcial ? parcial : '0')}</h5>
          </section>
          <div className="mt-3 d-flex justify-content-between">
            <Button onClick={agregarPagoParcial} disabled={(parcial && parcial != '0') ? false : true} variant="contained" color="success">Agregar pago parcial</Button>
            <Button variant="contained" color="success" className="ms-4" onClick={cerrarMesa}>Cerrar Mesa</Button>
          </div>
        </div>
      </main>

    </div>
  )
}

export default Caja