import { DtProducto } from "./DtProducto";

export interface DtEstadistica {
  cantidad: number;
  inicio: string;
  fin: string;
  producto: DtProducto;
}