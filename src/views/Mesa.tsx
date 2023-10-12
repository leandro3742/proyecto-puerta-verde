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
import DialogCart from "../components/DialogCart";
import ProductCard from "../components/ProductCard";

const Mesa = () => {
  const { mesa, precioTotal } = useParams()
  const { changeState } = spinnerStore()
  const [menu, setMenu] = useState<DtProducto[]>([])
  const [showModal, setShowModal] = useState(false)
  const [pedido, setPedido] = useState<Array<DtProduct>>([])
  const [productSelected, setProductSelected] = useState<number>(0);
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
        id: productSelected,
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
          id_Producto: elem.id,
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
          {menu.map(elem => (<ProductCard key={elem.id_Producto} elem={elem} addProduct={addProduct} />))}
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
      <DialogCart
        open={openPedido}
        setOpen={setOpenPedido}
        pedido={pedido}
        deleteProduct={deleteProduct}
        postPedido={postPedido}
      />
    </div>
  )
}

export default Mesa