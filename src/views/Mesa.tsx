import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import '../styles/mesa.css'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { DtProduct } from "../dataTypes/DtProduct";
import { getListProductos } from "../api/productos";
import { DtProducto } from "../dataTypes/DtProducto";
import spinnerStore from "../state/spinner";
import { DtPedido } from "../dataTypes/DtPedido";
import { crearPedido } from "../api/pedido";
import { enqueueSnackbar } from "notistack";
import { modificarMesa } from "../api/mesa";

const Mesa = () => {
  const { mesa, precioTotal } = useParams()
  const { changeState } = spinnerStore()
  const [menu, setMenu] = useState<DtProducto[]>([])
  const [showModal, setShowModal] = useState(false)
  const [pedido, setPedido] = useState<Array<DtProduct>>([])
  const [productSelected, setProductSelected] = useState<null | string | number>(null);
  const [obs, setObs] = useState('')
  const [openPedido, setOpenPedido] = useState(false)

  const addProduct = (productId: number) => {
    setShowModal(true)
    setProductSelected(productId)
  }

  const confirmProduct = () => {
    const existPedido = pedido.find(elem => elem.id == productSelected)
    if (existPedido && existPedido.obs === obs) {
      // Agrega dos veces el mismo elemento
      setPedido(pedido.map(elem => {
        return elem.id == productSelected && elem.obs === obs
          ?
          { ...elem, qty: elem.qty + 1 }
          :
          elem
      }))
    } else {
      const aux: DtProduct = {
        id: productSelected as string,
        product: menu.find(elem => elem.id_Producto == productSelected),
        obs,
        qty: 1
      }

      if (productSelected)
        setPedido([...pedido, aux])
    }
    setObs('')
    setShowModal(false)
  }

  useEffect(() => {
    changeState()
    getListProductos()
      .then(res => setMenu(res))
      .catch(err => console.log(err))
      .finally(() => changeState())
  }, [])

  const deleteProduct = (elem: DtProduct) => {
    const aux = pedido.filter(e => JSON.stringify(e) != JSON.stringify(elem))
    setPedido(aux)
  }
  const postPedido = async () => {
    console.log(pedido)
    const list_IdProductos: Array<{
      id_Producto: number,
      observaciones: string,
      nombreProducto: string
    }> = [];

    pedido.forEach(elem => {
      for (let i = 0; i < elem.qty; i++) {
        list_IdProductos.push({
          id_Producto: parseInt(elem.id),
          observaciones: elem.obs,
          nombreProducto: ''
        })
      }
    })
    const totalPedido = pedido.reduce((acc, elem) => acc + (elem.product?.precio || 0) * elem.qty, 0)
    const newPedido: DtPedido = {
      id_Pedido: 0,
      valorPedido: totalPedido,
      id_Cli_preferencial: 0,
      pago: false,
      username: 'fbauza2014@gmail.com',
      id_Mesa: mesa ? parseInt(mesa) : 0,
      estadoProceso: false,
      hora_ingreso: new Date().toISOString(),
      fecha_ingreso: new Date().toISOString(),
      numero_movil: '',
      list_IdProductos
    }
    try {
      changeState()
      const create = await crearPedido(newPedido)
      console.log(create)
      if (create.isOk === false) throw new Error(create.message)
      enqueueSnackbar('Pedido creado', { variant: 'success' })
      // Update mesa
      if (!mesa) throw new Error('No se pudo actualizar la mesa')
      if (!precioTotal) throw new Error('No se pudo actualizar la mesa')
      const updateMesa = await modificarMesa({ id: parseInt(mesa), precioTotal: parseInt(precioTotal) + totalPedido })
      console.log(updateMesa)
      changeState()
    }
    catch (err) {
      enqueueSnackbar('Error al crear el pedido, ' + err, { variant: 'error' })
      changeState()
    }
  }

  return (
    <div>
      <div style={{ opacity: showModal ? 0.1 : 1, pointerEvents: showModal ? 'none' : 'auto' }}>
        <div className="d-flex  justify-content-between p-2">
          <Link to='/mesero'><Button>Volver</Button></Link>
          <Button startIcon={<AddShoppingCartIcon />} onClick={() => setOpenPedido(true)}>Ver pedido</Button>
        </div>

        <section className="d-flex flex-wrap justify-content-around">
          {menu.map(elem => {
            return (
              <article key={elem.id_Producto} className="carta-background" onClick={() => addProduct(elem.id_Producto)}>
                <h5 className="text-center">{elem.nombre}</h5>
                <p className="text-center">${elem.precio}</p>
              </article>
            )
          })}
        </section>
      </div>
      <dialog open={showModal} className="dialog-obs py-2">
        <h6>Observaciones</h6>
        <textarea onChange={(e) => setObs(e.target.value)} value={obs} />
        <section className="d-flex justify-content-between mt-1">
          <Button color="error" size="small" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button startIcon={<AddShoppingCartIcon />} size="medium" onClick={confirmProduct}>Agregar</Button>
        </section>
      </dialog>
      <dialog open={openPedido} className="dialog-cart">
        <header>
          <h5>Pedido</h5>
          <hr />
        </header>
        <section className="d-flex flex-column">
          {pedido.map(elem => {
            return (
              <article key={elem.id + elem.obs} className="p-2 rounded dialog-article">
                <section className="d-flex justify-content-between">
                  <div className="d-flex flex-column">
                    <span>{elem.product?.nombre}</span>
                    <span className="ms-4 text-secondary">{elem.obs}</span>
                    <span className="ms-4 text-secondary">Cant: {elem.qty}</span>
                  </div>
                  <p>${elem.product?.precio}</p>
                </section>
                <div className="d-flex justify-content-end mt-2">
                  <Button size="small" color="error" onClick={() => deleteProduct(elem)}>Eliminar</Button>
                  {/* <Button size="small" sx={{ backgroundColor: '#f1f1f1', color: 'black' }} className="ms-5" onClick={() => editProduct()}>Editar</Button> */}
                </div>
              </article>
            )
          })}
        </section>
        <hr />
        <footer className="d-flex justify-content-between mt-3 jus">
          <Button size="small" color="error" onClick={() => setOpenPedido(false)}>Cancelar</Button>
          <Button size="small" onClick={postPedido} >Enviar</Button>
        </footer>
      </dialog>
    </div>
  )
}

export default Mesa