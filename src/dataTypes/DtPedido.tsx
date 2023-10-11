export interface DtPedido {
  id_Pedido: number,
  valorPedido: number,
  pago: boolean,
  username: string,
  id_Cli_preferencial: number,
  id_Mesa: number,
  estadoProceso: boolean,
  hora_ingreso: string,
  fecha_ingreso: string,
  numero_movil: string,
  list_IdProductos: Array<{
    id_Producto: number,
    observaciones: string
    nombreProducto: string
  }>
}

export interface DtListaProductosBackend {
  id_Producto: number,
  nombreProducto: string,
  observaciones: string
}
export interface DtListaProductos {
  id_Producto: number,
  nombreProducto: string,
  observaciones: string
  cant: number,
}