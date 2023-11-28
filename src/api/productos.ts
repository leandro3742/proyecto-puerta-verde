import { BACKEND_URL } from "../assets/constant";
import { DtProducto } from "../dataTypes/DtProducto";
import { DtProducto_Ingrediente } from "../dataTypes/DtProducto_Ingrediente";

export const agregarProducto = async (Producto: DtProducto) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/agregarProducto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(Producto)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const agregarIngredienteProducto = async (Ingredientes: DtProducto_Ingrediente) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/agregarProductos_Ingredientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
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
    const response = await fetch(BACKEND_URL + 'api/modificarProducto', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
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

export const listarIngredientesProductos = async (idProducto: number) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarIngredientesProducto' + idProducto, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const getListProductos = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarProductos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }

    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const getListByTipo = async (tipo: string) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarProductosPorTipo' + tipo, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const ListarProductosTipo = async (idProducto: number) => {
  try {
    const response = await fetch(BACKEND_URL + `api/listarProductosPorTipo/${idProducto}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }

    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const quitarProductos_Ingredientes = async (Productos_Ingredientes: DtProducto_Ingrediente) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/quitarProductos_Ingredientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(Productos_Ingredientes)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}
