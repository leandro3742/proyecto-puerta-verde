import { BACKEND_URL } from "../assets/constant";
import { DtProducto } from "../dataTypes/DtProducto";
import { DtProducto_Ingrediente } from "../dataTypes/DtProducto_Ingrediente";

export const agregarProducto = async (Producto: DtProducto) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/agregarProducto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Producto)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const agregarIngredienteProducto = async (Ingredientes: DtProducto_Ingrediente[]) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/agregarProducto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Ingredientes)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const actualizarProducto = async (Producto: DtProducto) => {
  try {
    console.log(Producto);
    const response = await fetch(BACKEND_URL + 'api/modificarProducto', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Producto)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const eliminarProducto = async (idProducto: number) => {
  try {
    const response = await fetch(BACKEND_URL + `api/bajaProducto/${idProducto}`, {
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

export const listarIngredientesProductos = async (idProducto: number) => {
  try {
    const response = await fetch(BACKEND_URL + `api/listarIngredientesProducto/${idProducto}`);
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const getListProductos = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarProductos');
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const ListarProductosTipo = async (idProducto: number) => {
  try {
    const response = await fetch(BACKEND_URL + `api/listarProductosPorTipo/${idProducto}`);
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

