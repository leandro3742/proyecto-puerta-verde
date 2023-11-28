import { BACKEND_URL } from "../assets/constant";
//import { DtCategoria } from "../dataTypes/DtCategoria";

export const listarCategorias = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarCategorias', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    const data = await response.json();
    console.log('Las categorias son: ' + data)
    return data;
  } catch (err) {
    throw err;
  }
}