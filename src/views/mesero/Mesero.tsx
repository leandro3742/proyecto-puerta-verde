import { Button } from "@mui/material"
import ListMesas from "../ListMesas"
import { useState } from "react"
import '../../styles/mesero.css'
import colors from "../../assets/colors"
import { agregarMesa } from "../../api/mesa"
import { DtMesa } from "../../dataTypes/DtMesa"
import spinnerStore from "../../state/spinner"

const Mesero = () => {
  const [openModal, setOpenModal] = useState(false)
  const [nombreMesa, setNombreMesa] = useState('')
  const { changeState } = spinnerStore()
  const [reload, setReload] = useState(false)
  const createMesa = async () => {
    try {
      changeState()
      const newMesa: DtMesa = {
        id_Mesa: '0',
        nombre: nombreMesa,
        enUso: false,
        precioTotal: 0
      }
      const response = await agregarMesa(newMesa)
      console.log(response)
      changeState()
      setOpenModal(false)
      setNombreMesa('')
      setReload(true)
    }
    catch (error) {
      changeState()
      console.log(error)
    }
  }

  return (
    <div>
      <Button className="m-3" onClick={() => setOpenModal(true)}>Agregar mesa</Button>
      <ListMesas url="mesero" reload={reload} setReload={setReload} />
      <dialog open={openModal} className="dialog-mesero">
        <h1 className="text-center">Crear mesa</h1>
        <section className="d-flex flex-column justify-content-center">
          <h5 className="text-center">Nombre</h5>
          <input value={nombreMesa} onChange={(e) => setNombreMesa(e.target.value)} type="text" className="color-Style" />
        </section>
        <footer className="mt-3 d-flex justify-content-between">
          <Button
            sx={{ backgroundColor: colors.smoke, color: 'black' }}
            onClick={() => setOpenModal(false)}
          >
            Atras
          </Button>
          <Button onClick={createMesa}>Crear mesa</Button>
        </footer>
      </dialog>
    </div>
  )
}

export default Mesero