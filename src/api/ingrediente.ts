import { BACKEND_URL } from "../assets/constant";
import { DtIngrediente } from "../dataTypes/DtIngrediente";

export const agregarIngrediente = async (Ingrediente: DtIngrediente) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/agregarIngrediente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Ingrediente)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const actualizarIngrediente = async (Ingrediente: DtIngrediente) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/modificarIngrediente', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Ingrediente)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const eliminarIngrediente = async (idIngrediente: number) => {
  try {
    const response = await fetch(BACKEND_URL + `api/bajaIngrediente/${idIngrediente}`, {
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

export const listarIngredientes = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarIngredientes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}