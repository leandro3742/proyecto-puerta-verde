import { BACKEND_URL } from "../assets/constant";
import { DtEstadistica } from "../dataTypes/DtEstadistica";

interface props {
  fechaInicio: string,
  fechaFin: string,
  type: number
}
export const getAllEstadisticas = async (props: props): Promise<Array<DtEstadistica>> => {
  try {
    let url = '';
    if (props.type === 1)
      url = BACKEND_URL + 'api/todoslosproductos'
    else if (props.type === 2)
      url = BACKEND_URL + 'api/estadisticas/ventasPorProducto'
    else if (props.type === 3)
      url = BACKEND_URL + 'api/estadisticas/ventasPorCategoria'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cantidad: 0,
        inicio: props.fechaInicio,
        fin: props.fechaFin,
        producto: {
          id_Producto: 0,
          nombre: "string",
          descripcion: "string",
          precio: 0,
          tipo: 1
        }
      })
    })
    const data = await response.json()
    return data;
  } catch (error) {
    console.log(error)
    throw error
  }
}