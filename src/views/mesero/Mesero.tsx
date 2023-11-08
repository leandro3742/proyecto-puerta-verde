import { Button } from "@mui/material"
import ListMesas from "../ListMesas"
import { useState } from "react"
import '../../styles/mesero.css'
import colors from "../../assets/colors"

const Mesero = () => {
  const [openModal, setOpenModal] = useState(false)
  return (
    <div>
      <Button className="m-3" onClick={() => setOpenModal(true)}>Agregar mesa</Button>
      <ListMesas url="mesero" />
      <dialog open={openModal} className="dialog-mesero">
        <h1 className="text-center">Crear mesa</h1>
        <section className="d-flex flex-column justify-content-center">
          <h5 className="text-center">Nombre</h5>
          <input type="text" className="color-Style" />
        </section>
        <footer className="mt-3 d-flex justify-content-between">
          <Button
            sx={{ backgroundColor: colors.smoke, color: 'black' }}
            onClick={() => setOpenModal(false)}
          >
            Atras
          </Button>
          <Button>Crear mesa</Button>
        </footer>
      </dialog>
    </div>
  )
}

export default Mesero