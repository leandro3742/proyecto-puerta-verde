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
    console.log(Pedido)
    const response = await fetch(BACKEND_URL + 'api/actualizarPedido', {
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

export const listarPedidosPorTipo = async (tipo: number) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/listarPedidosPorTipo' + tipo)
    const data: Array<DtPedido> = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

export const finalizarPedido = async (id: number) => {
  try {
    const response = await fetch(BACKEND_URL + 'api/finalizarPedido/' + id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data: { statusOk: boolean, statusMessage: string } = await response.json()
    return data
  } catch (error) {
    throw error
  }
}