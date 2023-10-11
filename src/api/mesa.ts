import { BACKEND_URL } from "../assets/constant";

export const getListMesa = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarMesas');
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const modificarMesa = async ({ id, precioTotal }: { id: number, precioTotal: number }) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/modificarMesa', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_Mesa: id,
        enUso: true,
        precioTotal,
      })
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
}