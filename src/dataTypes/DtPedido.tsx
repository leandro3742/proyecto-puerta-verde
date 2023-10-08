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
  lista_IdProductos: Array<{
    id_Producto: number,
    observacion: string
  }>
}