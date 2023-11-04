import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DataItem } from '../../dataTypes/DataItem';

interface props {
  data: Array<DataItem>
}

const BarType = (props: props) => {
  return (
    <div className='d-flex'>
      <BarChart
        width={500}
        height={400}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="key" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="cant" fill="#82ca9d" />
      </BarChart>
      <section>
        <h1>Referencias</h1>
        {props.data.map(elem => {
          return (
            <div key={elem.key}>
              <p>{elem.key}. {elem.name}</p>
            </div>
          )
        })}
      </section>
    </div>
  );
};

export default BarType;
