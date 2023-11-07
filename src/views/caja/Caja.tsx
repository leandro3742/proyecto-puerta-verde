import { useEffect, useState } from "react"
import ListMesas from "../ListMesas"
import spinnerStore from "../../state/spinner"
import { getCajaActiva } from "../../api/caja"
import { Button } from "@mui/material"

const Caja = () => {
  const { changeState } = spinnerStore()
  const [cajaActiva, setCajaActiva] = useState<number | null>(null)

  useEffect(() => {
    changeState()
    getCajaActiva()
      .then(res => {
        if (res.length === 0)
          setCajaActiva(-1)
        else
          setCajaActiva(1)
      })
      .catch(err => console.log(err))
      .finally(() => changeState())
  }, [])

  const closeCaja = () => {

  }

  if (cajaActiva)
    return (
      <div id="caja">
        {cajaActiva === 1 &&
          <>
            <ListMesas url='caja' />
            <footer className='d-flex justify-content-end'>
              <Button variant='contained' color='secondary' onClick={closeCaja}>Cerrar caja</Button>
            </footer>
          </>
        }
        {cajaActiva === -1 &&
          <>
            <h1>No hay caja activa</h1>
            <footer className='d-flex justify-content-end'>
              <Button variant='contained' color='secondary'>Abrir caja</Button>
            </footer>
          </>
        }
      </div>
    )
}

export default Caja