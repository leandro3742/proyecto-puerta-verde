import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import '../styles/mesa.css'
const menu = [
  {
    id: 1,
    name: 'Hamburguesa',
    price: 100,
    description: 'Hamburguesa con queso',
  },
  {
    id: 2,
    name: 'Pizza',
    price: 120,
    description: 'Pizza de pepperoni',
  },
  {
    id: 3,
    name: 'Sushi',
    price: 150,
    description: 'Sushi de salmón',
  },
  {
    id: 4,
    name: 'Ensalada',
    price: 70,
    description: 'Ensalada de pollo',
  },
  {
    id: 5,
    name: 'Tacos',
    price: 90,
    description: 'Tacos de carne asada',
  },
  {
    id: 6,
    name: 'Pasta',
    price: 80,
    description: 'Pasta al pesto',
  },
  {
    id: 7,
    name: 'Pollo a la parrilla',
    price: 110,
    description: 'Pollo a la parrilla con verduras',
  },
  {
    id: 8,
    name: 'Sándwich',
    price: 60,
    description: 'Sándwich de jamón y queso',
  },
  {
    id: 9,
    name: 'Tarta',
    price: 85,
    description: 'Tarta de manzana',
  },
  {
    id: 10,
    name: 'Burrito',
    price: 95,
    description: 'Burrito de cerdo',
  },
  {
    id: 11,
    name: 'Hot Dog',
    price: 75,
    description: 'Hot Dog con mostaza y ketchup',
  },
  {
    id: 12,
    name: 'Sopa',
    price: 55,
    description: 'Sopa de tomate',
  },
  {
    id: 13,
    name: 'Salmón',
    price: 130,
    description: 'Salmón a la parrilla',
  },
  {
    id: 14,
    name: 'Tarta de chocolate',
    price: 90,
    description: 'Tarta de chocolate con crema',
  },
  {
    id: 15,
    name: 'Filete de res',
    price: 140,
    description: 'Filete de res a la parrilla',
  },
];

const Mesa = () => {
  const { mesa } = useParams()
  console.log(mesa);
  return (
    <div>
      <Link to='/mesero'><Button>Volver</Button></Link>
      <section className="d-flex flex-wrap justify-content-around">
        {menu.map(elem => {
          return (
            <article key={elem.id} className="carta-background">
              <h5 className="text-center">{elem.name}</h5>
              <p className="text-center">${elem.price}</p>
            </article>
          )
        })}
      </section>
    </div>
  )
}

export default Mesa