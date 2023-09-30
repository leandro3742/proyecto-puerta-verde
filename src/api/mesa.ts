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