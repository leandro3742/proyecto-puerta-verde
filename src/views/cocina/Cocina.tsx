import { Button } from "@mui/material"
import '../../styles/cocina.css'
import { useEffect, useState } from "react"
import { listarPedidosActivos } from "../../api/pedido"
import spinnerStore from "../../state/spinner"
import { DtListaProductos, DtListaProductosBackend, DtPedido } from "../../dataTypes/DtPedido"
import { cocinaStore } from "../../state/cocina"

const Cocina = () => {
  const { notifications } = cocinaStore()
  const { changeState } = spinnerStore()
  const [pedidos, setPedidos] = useState<Array<DtPedido>>([])

  useEffect(() => {
    changeState()
    listarPedidosActivos().then(res => {
      console.log(res);
      setPedidos(res)
    })
      .catch(err => console.log(err))
      .finally(() => changeState())
  }, [])

  useEffect(() => {
    console.log(notifications)
    // changeState()
    // listarPedidosActivos().then(res => setPedidos(res))
    //   .catch(err => console.log(err))
    //   .finally(() => changeState())
  }, [notifications])
  const parseListProducts = (list: Array<DtListaProductosBackend>): Array<DtListaProductos> => {
    const newList: Array<DtListaProductos> = []
    list.forEach(elem => {
      const exist = newList.find(product => product.id_Producto == elem.id_Producto && product.observaciones == elem.observaciones)
      if (exist) {
        exist.cant++
      } else {
        newList.push({ ...elem, cant: 1 })
      }
    })
    return newList
  }
  const completeOrder = () => { }

  return (
    <div className="m-3 d-flex flex-wrap d-flex justify-content-around">
      {pedidos.map(pedido => {
        return (
          <article key={pedido.id_Pedido} className="m-3 p-3 rounded shadow article-cocina">
            {pedido.id_Mesa &&
              <h1>Orden para:  Mesa {pedido.id_Mesa}</h1>
            }
            {parseListProducts(pedido.list_IdProductos).map((producto, index) => {
              return (
                <section key={index} className="rounded p-3 article-1">
                  <h4>{producto.nombreProducto}</h4>
                  <h5 className="ms-3 text-secondary">Cant: {producto.cant}</h5>
                  {producto.observaciones && <h5 className="ms-3 text-secondary">Obs: {producto.observaciones}</h5>}
                </section>
              )
            })}
            <div className="d-flex justify-content-end">
              <Button onClick={completeOrder}>Orden pronta</Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default Cocina