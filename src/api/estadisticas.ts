import { BACKEND_URL } from "../assets/constant";

interface props {
  fechaInicio: string,
  fechaFin: string
}
export const getAllEstadisticas = async (props: props) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/todoslosproductos', {
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
    console.log(response)
    const data = await response.json()
    console.log(data);
    return data;
  } catch (error) {
    console.log(error)
    throw error
  }
}