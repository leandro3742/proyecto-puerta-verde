
import { Link } from 'react-router-dom'
// Styles
import '../styles/mesero.css'
import { useEffect, useState } from 'react'
import { getListMesa } from '../api/mesa'
import { DtMesa } from '../dataTypes/DtMesa'
import spinnerStore from '../state/spinner'
const Mesero = () => {
  const [mesas, setMesas] = useState<DtMesa[]>([])
  const { changeState } = spinnerStore()
  useEffect(() => {
    changeState()
    getListMesa()
      .then(res => {
        // Order by id_Mesa
        setMesas(res.sort((a: DtMesa, b: DtMesa) => parseInt(a.id_Mesa) - parseInt(b.id_Mesa)))
      })
      .catch(err => console.log(err))
      .finally(() => changeState())
  }, [])

  return (
    <div>
      <section className='d-flex flex-wrap justify-content-around'>
        {mesas.map(elem => {
          return (
            <Link to={`/mesero/${elem.id_Mesa}/${elem.precioTotal}`} key={elem.id_Mesa}>
              <article className={`mesas-background ${elem.enUso ? 'mesa-ocupada' : 'mesa-vacia'}`}>
                <div>
                  <h5 className='text-center'>Mesa {elem.id_Mesa}</h5>
                </div>
                {elem.enUso &&
                  <div className='mesas-total'>
                    <p className='text-center'>${elem.precioTotal}</p>
                  </div>
                }
              </article>
            </Link>
          )
        })}
      </section>
    </div>
  )
}

export default Mesero