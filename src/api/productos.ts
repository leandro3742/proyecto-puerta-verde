import { BACKEND_URL } from "../assets/constant";

export const getListProductos = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarProductos');
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}