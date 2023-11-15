import { useEffect, useState } from "react"
import ListMesas from "../ListMesas"
import spinnerStore from "../../state/spinner"
import { cerrarCajaActiva, crearCaja, getCajaActiva } from "../../api/caja"
import { Button } from "@mui/material"
import { DtCaja } from "../../dataTypes/DtCaja"
import { enqueueSnackbar } from "notistack"
import '../../styles/caja.css'
const Caja = () => {
  const { changeState } = spinnerStore()
  const [caja, setCaja] = useState<DtCaja>()
  const [cajaActiva, setCajaActiva] = useState<number | null>(null)
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    changeState()
    getCajaActiva()
      .then(res => {
        if (res.length === 0)
          setCajaActiva(-1)
        else {
          setCaja(res[0])
          setCajaActiva(1)
        }
      })
      .catch(err => console.log(err))
      .finally(() => changeState())
  }, [])

  const closeCaja = async () => {
    try {
      changeState()
      const response = await cerrarCajaActiva()
      if (!response.statusOk) throw new Error(response.message)
      enqueueSnackbar('Caja cerrada con exito', { variant: 'success' })
      setCaja(undefined)
      setCajaActiva(-1)
      changeState()
      setOpenModal(false)
    }
    catch (err) {
      console.log(err)
      enqueueSnackbar('Error al cerrar la caja', { variant: 'error' })
      changeState()
      setOpenModal(false)
    }
  }

  const abrirCaja = async () => {
    try {
      changeState()
      const newCaja: DtCaja = {
        id: 0,
        fecha: new Date(),
        totalPrecios: 0,
        estado: true
      }
      const response = await crearCaja(newCaja)
      console.log(response)
      enqueueSnackbar('Caja abierta con exito', { variant: 'success' })
      changeState()
      setCajaActiva(1)
    }
    catch (err) {
      console.log(err)
      enqueueSnackbar('Error al abrir la caja', { variant: 'error' })
      changeState()
    }
  }

  if (cajaActiva)
    return (
      <div id="caja">
        {cajaActiva === 1 &&
          <div>
            <ListMesas url='caja' />
            <footer className='d-flex justify-content-end'>
              <Button variant='contained' color='secondary' onClick={() => setOpenModal(true)}>Cerrar caja</Button>
            </footer>
          </div>
        }
        {cajaActiva === -1 &&
          <div className="d-flex justify-content-center">
            <Button id="bodyCaja" size='large' variant='contained' color='secondary' onClick={abrirCaja}>Abrir caja</Button>
          </div>
        }
        <dialog open={openModal} className="dialog-caja shadow">
          <section>
            <h1 className="text-center">Seguro que desea cerrar la caja ?</h1>
            <hr />
          </section>
          <section>
            <h3>Precio total: ${caja?.totalPrecios}</h3>
            <hr />
          </section>
          <section className="d-flex justify-content-end">
            <Button variant='outlined' color="error" onClick={() => setOpenModal(false)} >Cancelar</Button>
            <Button variant='outlined' color='primary' className="mx-3" onClick={closeCaja}>Cerrar caja</Button>
          </section>
        </dialog>
      </div>
    )
}

export default Caja