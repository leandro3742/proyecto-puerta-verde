import { Button } from '@mui/material';
import { DtProduct } from '../dataTypes/DtProduct';

interface props {
  open: boolean,
  setOpen: (open: boolean) => void
  pedido: Array<DtProduct>
  deleteProduct: (product: DtProduct) => void
  postPedido: () => void
  children?: React.ReactNode
}
const DialogCart = (props: props) => {
  const {
    open, setOpen, pedido, deleteProduct, postPedido, children
  } = props;
  return (
    <dialog open={open} className="dialog-cart">
      <header>
        <h5>Pedido</h5>
        <hr />
      </header>
      {children}
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
        <Button size="small" color="error" onClick={() => setOpen(false)}>Cancelar</Button>
        <Button size="small" onClick={postPedido} >Enviar</Button>
      </footer>
    </dialog>
  )
}

export default DialogCart