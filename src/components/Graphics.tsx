import { Button, FormControl, MenuItem, Select } from "@mui/material";
import '../styles/graphics.css'
import { useState } from "react";
import { getAllEstadisticas } from "../api/estadisticas";
import spinnerStore from "../state/spinner";

const Graphics = () => {
  const { changeState } = spinnerStore()
  const [inicio, setInicio] = useState<Date>(new Date());
  const [fin, setFin] = useState<Date>(new Date());
  const [tipoProducto, setTipoProducto] = useState<number>(1);

  const search = async () => {
    let auxInicio = inicio
    auxInicio.setUTCDate(auxInicio.getUTCDate() + 1)
    auxInicio.setUTCHours(0, 0, 0, 0);
    const inicioFormat = auxInicio.toISOString()
    console.log(inicioFormat)

    let auxFin = fin
    auxFin.setUTCDate(auxFin.getUTCDate() + 1)
    auxFin.setUTCHours(0, 0, 0, 0);
    const finFormat = auxFin.toISOString()
    changeState()
    getAllEstadisticas({ fechaInicio: inicioFormat, fechaFin: finFormat, })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        changeState()
      })

    console.log('search')
    console.log(fin)
  }

  return (
    <div>
      <article className="graphic-settings m-3 p-3">
        <h1 className="text-center">Ajustes</h1>
        <div>
          <section className="row mb-3">
            <div className="col-5 d-flex flex-column">
              <label className="mx-3 mt-3">Inicio</label>
              <label className="mx-3 mt-3">Fin</label>
              <label className="mx-3 mt-3">Buscar</label>

            </div>
            <div className="col-7 d-flex flex-column">
              <input value={inicio.toISOString().split('T')[0]} onChange={(e) => setInicio(new Date(e.target.value))} className="mt-3" type="date" />
              <input value={fin.toISOString().split('T')[0]} onChange={(e) => setFin(new Date(e.target.value))} className="mt-3" type="date" />
              <FormControl className="mt-3" variant="standard" sx={{ minWidth: 120 }}>
                <Select
                  id="productos"
                  value={tipoProducto}
                  label="Productos"
                  onChange={(e) => setTipoProducto(e.target.value as number)}
                >
                  <MenuItem value={1}>Todos</MenuItem>
                  <MenuItem value={2}>Comida</MenuItem>
                  <MenuItem value={3}>Bebida</MenuItem>
                </Select>
              </FormControl>
            </div>
          </section>
          <footer className="d-flex justify-content-end m-3">
            <Button variant="contained" color="primary" onClick={search}>
              Generar
            </Button>
          </footer>
        </div>
      </article>
      <div>
      </div>
    </div>
  );
};

export default Graphics;
