
const mesas = ['Mesa 1', 'Mesa 2', 'Mesa 3', 'Mesa 4', 'Mesa 5', 'Mesa 6', 'Mesa 7', 'Mesa 8', 'Mesa 9', 'Mesa 10']
import { Link } from 'react-router-dom'
// Styles
import '../styles/mesero.css'
const Mesero = () => {
  return (
    <div>
      <section className='d-flex flex-wrap justify-content-around'>
        {mesas.map(elem => {
          return (
            <Link to={`/mesero/${elem}`} key={elem}>
              <article className='mesas-background d-flex flex-column'>
                <div>
                  <h5 className='text-center'>{elem}</h5>
                </div>
                <div className='mesas-total'>
                  <p className='text-center'>$3000</p>
                </div>
              </article>
            </Link>
          )
        })}
      </section>
    </div>
  )
}

export default Mesero