import { BACKEND_URL } from "../assets/constant";
import { DtCliente } from "../dataTypes/DtCliente";

export const agregarCliente = async (Cliente: DtCliente) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/agregarCliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Cliente)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const actualizarCliente = async (Cliente: DtCliente) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/actualizarCliente', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Cliente)
    })
    const data = await response.json()
    console.log("Lo que responde es: "+data)
    return data;
  } catch (error) {
    throw error
  }
}

export const eliminarCliente = async (idCliente: number) => {
  try {
    const response = await fetch(BACKEND_URL + `api/bajaCliente/${idCliente}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export const getListClientes = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarCliente');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
}