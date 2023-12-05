import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import {useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { saveAs } from 'file-saver';
// Styles
import '../../styles/cerrarCaja.css'
import { agregarPagoParcial as fetchAgregarPagoPArcial, cerrarCuentaMesa } from "../../api/mesa"
import spinnerStore from "../../state/spinner"
import { enqueueSnackbar } from "notistack"
import { DtEstadistica } from "../../dataTypes/DtEstadistica"
import { listarPedidosPorMesa } from "../../api/pedido"

const CerrarCaja = () => {
  const { mesa, precioTotal, nombre} = useParams()
  const [parcial, setParcial] = useState<string>('0')
  const [Productos, setProductos] = useState<DtEstadistica[]>([]);
  const { changeState } = spinnerStore()
  const navigate = useNavigate()

  const agregarPagoParcial = () => {
    const totalParcial: number = parseInt(parcial ? parcial : '0')
    changeState()
    fetchAgregarPagoPArcial(parseInt(mesa ? mesa : '0'), totalParcial)
      .then(() => {
        enqueueSnackbar('Pago parcial agregado', { variant: 'success' })
        navigate(-1)
      })
      .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
      .finally(() => changeState())
  }

  const base64ToUint8Array = (base64: string) => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };
  
  const cerrarMesa = async () => {
    try {
      changeState();
      const aux = await cerrarCuentaMesa(parseInt(mesa ? mesa : '0'));
      enqueueSnackbar('Mesa cerrada', { variant: 'success' });
      navigate(-1);
      changeState();
  
      const bytes = base64ToUint8Array(aux);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      saveAs(blob, 'document.pdf');
    } catch (err) {
      // Manejar el error, si es necesario
    }
  };
  
  
  const controlModal = (modal: string, accion: string) => {
    const elemento = document.getElementById(modal);
    if (elemento) {
        if (accion === 'abrir') {
            elemento.classList.add('show');
            elemento.style.display = 'block';
        } else if (accion === 'cerrar') {
            elemento.classList.remove('show');
            elemento.style.display = 'none';
        }
    }
  };

  const verProductos = async (mesa: string | undefined) => {
    if (mesa !== undefined) {
      const aux = await listarPedidosPorMesa(parseInt(mesa))
      setProductos(aux);
      if(aux.length > 0){
        controlModal("modalProductos", "abrir");
      }else{
        enqueueSnackbar('La mesa no posee Productos', { variant: 'warning' })
      }
    }
  }

  return (
    <div>
      <div className="d-flex  justify-content-between p-2">
        <Link to='/caja'><Button>Volver</Button></Link>
      </div>

      <main className="d-flex align-items-center justify-content-center">
        <div className="caja-card p-3">
          <section>
            <h1>Pedido {nombre}</h1>
          </section>
          <section className="my-3 d-flex justify-content-end">
            <Button onClick={() => verProductos(mesa)}>
              Listar productos
            </Button>
          </section>
          <section>
            <h5>Total: ${precioTotal}</h5>
            <div className="pago-parcial d-flex aling-items-center">
              <h5 className="m-0 p-0 text-center">Pago parcial: $</h5>
              <input type="number" value={parcial ? parseInt(parcial) : 0} onChange={(e) => setParcial(e.target.value)} />
            </div>
            <h5>Resto: ${parseInt(precioTotal ? precioTotal : '0') - parseInt(parcial ? parcial : '0')}</h5>
          </section>
          <div className="mt-3 d-flex justify-content-between">
            <Button onClick={agregarPagoParcial} disabled={(parcial && parcial != '0') ? false : true} variant="contained" color="success">Agregar pago parcial</Button>
            <Button variant="contained" color="success" className="ms-4" onClick={cerrarMesa}>Cerrar Mesa</Button>
          </div>
        </div>
      </main>
      <div id='modalProductos' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className='modal-dialog'>
          <div className='modal-content' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className='modal-header'>
              <label className='h5'>Lista de Productos</label>
            </div>
            <div className='modal-body'>
              <div className='row mt-3'>
                <div>
                  <div className='table-responsive'>
                    <TableContainer component={Paper} elevation={2} style={{ marginTop: '30px', margin: '0 auto', width: '100%' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Cantidad</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Productos.map((elem, index) => (
                            <TableRow key={index}>
                              <TableCell>{elem.producto.nombre}</TableCell>
                              <TableCell>{elem.producto.precio}</TableCell>
                              <TableCell>{elem.cantidad}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <Button onClick={() => controlModal('modalProductos', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CerrarCaja
