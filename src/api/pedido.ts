import { BACKEND_URL } from "../assets/constant";
import { DtPedido } from "../dataTypes/DtPedido";

export const crearPedido = async (Pedido: DtPedido) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/agregarPedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Pedido)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const listarPedidosActivos = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarPedidosActivos')
    const data: Array<DtPedido> = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

export const updatePedido = async (Pedido: DtPedido) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/modificarPedido', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Pedido)
    })
    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}