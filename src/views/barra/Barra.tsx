import { useEffect, useState } from "react"
import { getListProductos } from "../../api/productos"
import spinnerStore from "../../state/spinner"
import { DtProducto } from "../../dataTypes/DtProducto"
import { Button, IconButton } from "@mui/material"
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import '../../styles/barra.css'
import { DtProduct } from "../../dataTypes/DtProduct"
import DialogCart from "../../components/DialogCart"
import ProductCard from "../../components/ProductCard"

const Barra = () => {
  const { changeState } = spinnerStore()
  const [menu, setMenu] = useState<DtProducto[]>([])
  const [menuFiltrado, setMenuFiltrado] = useState<DtProducto[]>([])
  const [search, setSearch] = useState<string>("")
  const [pedido, setPedido] = useState<Array<DtProduct>>([])
  const [openPedido, setOpenPedido] = useState(false)
  useEffect(() => {
    changeState()
    getListProductos()
      .then(res => setMenu(res))
      .catch(err => console.log(err))
      .finally(() => changeState())
  }, [])

  useEffect(() => {
    setMenuFiltrado(menu.filter(elem => elem.nombre.toLowerCase().includes(search.toLowerCase())))
  }, [search, menu])

  const addProduct = (id: number) => {
    pedido.find(elem => elem.id === id)
      ?
      setPedido(pedido.map(elem => {
        return elem.id === id
          ?
          { ...elem, qty: elem.qty + 1 }
          :
          elem
      }))
      :
      setPedido([...pedido, { id, qty: 1, obs: "", product: menu.find(elem => elem.id_Producto === id) }])
  }
  const deleteProduct = (elem: DtProduct) => {
    const aux = pedido.filter(e => JSON.stringify(e) != JSON.stringify(elem))
    setPedido(aux)
  }
  return (
    <div>
      <section className="d-flex justify-content-between mt-3 mx-5">
        <form className="search shadow px-3 " onSubmit={(e) => { e.preventDefault() }}>
          <input type="text" placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
          <IconButton type="button">
            <SearchIcon sx={{ color: 'black' }} />
          </IconButton>
        </form>
        <Button
          startIcon={<AddShoppingCartIcon />}
          onClick={() => setOpenPedido(true)}
        >
          Ver pedido
        </Button>
      </section>
      <section className="d-flex flex-wrap justify-content-around">
        {menuFiltrado.map(elem => (
          <ProductCard key={elem.id_Producto} elem={elem} addProduct={addProduct} />
        ))}
      </section>
      <DialogCart
        open={openPedido}
        setOpen={setOpenPedido}
        pedido={pedido}
        deleteProduct={deleteProduct}
        postPedido={() => { }}
      />
    </div>
  )
}

export default Barra