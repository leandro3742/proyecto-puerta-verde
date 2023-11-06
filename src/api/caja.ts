import { BACKEND_URL } from "../assets/constant";

export const getCajaActica = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarCajaavtiva');
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}