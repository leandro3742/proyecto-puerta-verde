import { DtProducto } from "../dataTypes/DtProducto"

interface props {
  elem: DtProducto
  addProduct: (id: number) => void
}
const ProductCard = (props: props) => {
  const { elem, addProduct } = props
  return (
    <article key={elem.id_Producto} className="carta-background" onClick={() => addProduct(elem.id_Producto)}>
      <h5 className="text-center">{elem.nombre}</h5>
      <p className="text-center">${elem.precio}</p>
    </article>
  )
}

export default ProductCard