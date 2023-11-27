import { BACKEND_URL } from "../assets/constant";
import { DtMesa } from "../dataTypes/DtMesa";

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
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        id_Mesa: id,
        nombre: '',
        enUso: true,
        precioTotal,
      })
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const cerrarCuentaMesa = async (id: number) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/cerarCuentaMesa', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        id_Mesa: id,
        enUso: false,
        precioTotal: 0,
      })
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const agregarMesa = async (Mesa: DtMesa) => {
  console.log('POST' + Mesa.id_Mesa + Mesa.enUso + Mesa.precioTotal);
  try {
    const response = await fetch(BACKEND_URL + 'api/agregarMesa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(Mesa)
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const bajaMesa = async (idMesa: number) => {
  try {
    const response = await fetch(BACKEND_URL + `api/bajaMesa/${idMesa}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export const agregarPrecioMesa = async (idMesa: number, precio: number) => {
  try {
    const response = await fetch(BACKEND_URL + `api/modificarPrecio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        id_Mesa: idMesa,
        precioTotal: precio,
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export const agregarPagoParcial = async (idMesa: number, pago: number) => {
  try {
    const response = await fetch(BACKEND_URL + `api/agregarPagoParcial/${idMesa}/${pago}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}