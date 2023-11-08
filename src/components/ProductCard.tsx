import { DtProducto } from "../dataTypes/DtProducto"
import '../styles/productCard.css'
interface props {
  elem: DtProducto
  addProduct: (id: number) => void
  children?: React.ReactNode
}
const ProductCard = (props: props) => {
  const { elem, addProduct, children } = props
  return (
    <article key={elem.id_Producto} className="carta-background" onClick={() => addProduct(elem.id_Producto)}>
      <h5 className="text-center">{elem.nombre}</h5>
      <p className="text-center">${elem.precio}</p>
      {children}
    </article>
  )
}

export default ProductCard