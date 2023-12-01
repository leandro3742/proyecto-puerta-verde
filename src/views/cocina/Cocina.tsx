import { Button } from "@mui/material"
import '../../styles/cocina.css'
import { useEffect, useState } from "react"
import { listarPedidosPorTipo, updatePedido } from "../../api/pedido"
import spinnerStore from "../../state/spinner"
import { DtListaProductos, DtListaProductosBackend, DtPedido } from "../../dataTypes/DtPedido"
import { cocinaStore } from "../../state/cocina"
import { enqueueSnackbar } from "notistack"
import Timer from "../../components/Timer"

const Cocina = () => {
  const { notifications } = cocinaStore()
  const { changeState } = spinnerStore()
  const [pedidos, setPedidos] = useState<Array<DtPedido>>([])
  const [firstCall, setFirstCall] = useState<boolean>(false)
  useEffect(() => {
    changeState()
    listarPedidosPorTipo(1)
      .then(res => {
        setPedidos(res)
      })
      .catch(err => console.log(err))
      .finally(() => changeState())
    setFirstCall(true)
  }, [])

  useEffect(() => {
    if (!firstCall) return
    listarPedidosPorTipo(1)
      .then(res => setPedidos(res))
      .catch(err => console.log(err))
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
  const completeOrder = (pedido: DtPedido) => {
    changeState()
    updatePedido({ ...pedido, estadoProceso: false })
      .then((res) => {
        if (!res.statusOk) throw res.statusMessage
        console.log(pedidos.filter(pedidoAux => pedidoAux.id_Pedido != pedido.id_Pedido))
        setPedidos(pedidos.filter(pedidoAux => pedidoAux.id_Pedido != pedido.id_Pedido))
      })
      .catch(err => enqueueSnackbar(err, { variant: 'error' }))
      .finally(() => changeState())
  }

  const changeBg = (id: number) => {
    document.querySelector(`#pedido${id.toString()}`)?.classList.remove('article-cocina')
    document.querySelector(`#pedido${id.toString()}`)?.classList.add('article-cocina-delay')
  }

  return (
    <div className="m-3 d-flex flex-wrap d-flex justify-content-around">
      {pedidos.map(pedido => {
        return (
          <article id={"pedido" + pedido.id_Pedido.toString()} key={pedido.id_Pedido} className="m-3 p-3 rounded shadow article-cocina">
            {pedido.id_Mesa &&
              <h1>{pedido.nombreMesa}</h1>
            }
            {parseListProducts(pedido.list_IdProductos).map((producto, index) => {
              return (
                <section key={index} className="rounded p-3 article-1">
                  <h4>{producto.nombreProducto}</h4>
                  <h5 className="ms-3">Cant: {producto.cant}</h5>
                  {producto.observaciones && <h5 className="ms-3 text-secondary">Obs: {producto.observaciones}</h5>}
                </section>
              )
            })}
            <Timer startDate={pedido.fecha_ingreso} pedidoId={pedido.id_Pedido} changeBg={changeBg} />
            <div className="d-flex justify-content-end">
              <Button onClick={() => completeOrder(pedido)}>Orden pronta</Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default Cocina