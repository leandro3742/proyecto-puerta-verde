import { BACKEND_URL } from "../assets/constant";
import { DtCaja } from "../dataTypes/DtCaja";

export const getCajaActiva = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarCajaavtiva', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'bearer ' + localStorage.getItem('token')
      }
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const sumarPrecioCaja = async (precio: number) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/sumarPrecioCaja/' + precio);
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const cerrarCajaActiva = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/cerrarCajaActiva');
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const crearCaja = async (caja: DtCaja) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/agregarCaja', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(caja)
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}