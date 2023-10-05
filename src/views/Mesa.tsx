import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import '../styles/mesa.css'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { DtProduct } from "../dataTypes/DtProduct";
import { getListProductos } from "../api/productos";
import { DtProducto } from "../dataTypes/DtProducto";
import spinnerStore from "../state/spinner";

const Mesa = () => {
  // const { mesa } = useParams()
  const { changeState } = spinnerStore()
  const [menu, setMenu] = useState<DtProducto[]>([])
  const [showModal, setShowModal] = useState(false)
  const [pedido, setPedido] = useState<Array<DtProduct>>([])
  const [productSelected, setProductSelected] = useState<null | string | number>(null);
  const [obs, setObs] = useState('')
  const [openPedido, setOpenPedido] = useState(false)

  const addProduct = (productId: string) => {
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
        <header style={{ height: '10%' }}>
          <h6>Pedido</h6>
        </header>
        <section style={{ height: '80%', overflowY: 'auto' }} className="d-flex flex-column">
          {pedido.map(elem => {
            return (
              <article key={elem.id} className="p-2 rounded dialog-article">
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
                  <Button size="small" className="ms-5">Editar</Button>
                </div>
              </article>
            )
          })}
        </section>
        <hr />
        <footer style={{ height: '10%' }} className="d-flex justify-content-between mt-3 jus">
          <Button size="small" color="error" onClick={() => setOpenPedido(false)}>Cancelar</Button>
          <Button size="small" >Enviar</Button>
        </footer>
      </dialog>
    </div>
  )
}

export default Mesa