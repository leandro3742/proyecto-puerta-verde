import { useEffect, useState } from "react"
import { getListByTipo } from "../../api/productos"
import spinnerStore from "../../state/spinner"
import { DtProducto } from "../../dataTypes/DtProducto"
import { Button, IconButton } from "@mui/material"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import '../../styles/barra.css'
import { DtProduct } from "../../dataTypes/DtProduct"
import DialogCart from "../../components/DialogCart"
import ProductCard from "../../components/ProductCard"
import { agregarPrecioMesa, getListMesa } from "../../api/mesa"
import { DtMesa } from "../../dataTypes/DtMesa"
import { DtPedido } from "../../dataTypes/DtPedido"
import { crearPedido } from "../../api/pedido"
import { enqueueSnackbar } from "notistack"

const Barra = () => {
  const { changeState } = spinnerStore()
  const [menu, setMenu] = useState<DtProducto[]>([])
  const [menuFiltrado, setMenuFiltrado] = useState<DtProducto[]>([])
  const [search, setSearch] = useState<string>("")
  const [pedido, setPedido] = useState<Array<DtProduct>>([])
  const [openPedido, setOpenPedido] = useState(false)
  const [mesas, setMesas] = useState<Array<DtMesa>>([])
  const [mesaSelected, setMesaSelected] = useState<string>('')

  useEffect(() => {
    changeState()
    Promise.all([
      getListByTipo('2'),
      getListMesa()
    ])
      .then(res => {
        setMenu(res[0])
        setMesas(res[1])
      })
      .catch(err => console.log(err))
      .finally(() => changeState())
  }, [])

  useEffect(() => {
    if (mesas.length > 0) {
      setMesaSelected(String(mesas[0].nombre));
    }
  }, [mesas]);

  useEffect(() => {
    setMenuFiltrado(menu.filter(elem => elem.nombre.toLowerCase().includes(search.toLowerCase())))
  }, [search, menu])

  const addProduct = (id: number) => {
    const aux = pedido.find(elem => elem.id == id)
    if (aux) {
      setPedido(pedido.map(elem => {
        return elem.id == id
          ?
          { ...elem, qty: elem.qty + 1 }
          :
          elem
      }))
    } else {
      const aux: DtProduct = {
        id,
        product: menu.find(elem => elem.id_Producto == id)
          ?
          menu.find(elem => elem.id_Producto == id)!
          :
          {} as DtProducto,
        obs: '',
        qty: 1
      }
      setPedido([...pedido, aux])
    }
  }

  const deleteProduct = (elem: DtProduct) => {
    const aux = pedido.filter(e => JSON.stringify(e) != JSON.stringify(elem))
    setPedido(aux)
  }

  const checkQty = (id: number) => {
    const aux = pedido.find(elem => elem.id == id)
    return aux ? aux.qty : 0
  }

  const postPedido = async () => {
    const typesAux: any = {}
    pedido.forEach(elem => {
      if (!typesAux[elem.product.tipo]) typesAux[elem.product.tipo] = []
      typesAux[elem.product.tipo].push(elem)
    })
    console.log(pedido)
    for (const key in typesAux) {
      const list = typesAux[key]
      const list_IdProductos: Array<{
        id_Producto: number,
        observaciones: string,
        nombreProducto: string
      }> = [];
      console.log(list);

      for (let i = 0; i < list.length; i++) {
        const elem = list[i];
        console.log(elem)
        // agregar la cantidad de veces que aparezca el producto
        for (let j = 0; j < elem.qty; j++) {
          list_IdProductos.push({
            id_Producto: elem.id,
            observaciones: elem.obs,
            nombreProducto: ''
          })
        }
      }

      const mesa = mesas.find(elem => elem.nombre == mesaSelected)
      console.log("La mesa es: " + mesa)
      if (!mesa)
        return ''
      const totalPedido = list.reduce((acc: number, elem: DtProduct) => acc + (elem.product?.precio || 0) * elem.qty, 0)
      const newPedido: DtPedido = {
        id_Pedido: 0,
        valorPedido: totalPedido,
        id_Cli_preferencial: 0,
        pago: false,
        username: 'fbauza2014@gmail.com',
        id_Mesa: parseInt(mesa?.id_Mesa),
        nombreMesa: '',
        estadoProceso: false,
        fecha_ingreso: new Date().toISOString(),
        numero_movil: '',
        list_IdProductos,
        tipo: parseInt(key),
      }
      try {
        changeState()
        const create = await crearPedido(newPedido)
        if (create.isOk === false) throw new Error(create.message)
        enqueueSnackbar('Pedido creado', { variant: 'success' })
        // Update mesa
        if (!mesa) throw new Error('No se pudo actualizar la mesa')
        await agregarPrecioMesa(parseInt(mesa.id_Mesa), totalPedido)
        changeState()
      }
      catch (err) {
        enqueueSnackbar('Error al crear el pedido, ' + err, { variant: 'error' })
        changeState()
      }
    }
    setPedido([])
    setOpenPedido(false)
  }

  return (
    <div>
      <section className="d-flex flex-lg-row flex-column-reverse justify-content-between mt-3 mx-5">
        <div>
          <form className="search shadow px-3" onSubmit={(e) => { e.preventDefault() }}>
            <input type="text" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
            <IconButton type="button">
              <SearchIcon sx={{ color: 'black' }} />
            </IconButton>
          </form>
        </div>
        <div className="d-flex justify-content-end mb-lg-0 mb-3">
          <Button
            startIcon={<AddShoppingCartIcon />}
            onClick={() => setOpenPedido(true)}
          >
            Ver pedido
          </Button>
        </div>
      </section>
      <section className="d-flex flex-wrap justify-content-around">
        {menuFiltrado.map(elem => (
          <ProductCard key={elem.id_Producto} elem={elem} addProduct={addProduct}>
            {checkQty(elem.id_Producto) > 0 &&
              <div className="container-counter">
                <div className="counter">
                  <span>{checkQty(elem.id_Producto)}</span>
                </div>
              </div>
            }
          </ProductCard>
        ))}
      </section>
      <DialogCart
        open={openPedido}
        setOpen={setOpenPedido}
        pedido={pedido}
        deleteProduct={deleteProduct}
        postPedido={postPedido}
      >
        <section>
          <h5 className="text-center">Elegir mesa</h5>
          <select
            className='form-control color-Style'
            value={mesaSelected}
            onChange={(e) => setMesaSelected(e.target.value)}
          >
            {mesas.map(elem => {
              return (
                <option>{elem.nombre}</option>
              )
            })}
          </select>
          <hr />
        </section>
      </DialogCart>
    </div>
  )
}

export default Barra