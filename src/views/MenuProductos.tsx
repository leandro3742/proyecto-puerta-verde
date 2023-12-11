import { useEffect, useState } from 'react';
import '../styles/producto.css';
import spinnerStore from '../state/spinner';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { getListProductos } from '../api/productos';
import { DtProducto } from '../dataTypes/DtProducto';

const MenuProductos = () => {
    const { changeState } = spinnerStore();
    const [productos, setProductos] = useState<DtProducto[]>([]);
    const [selectedType, setSelectedType] = useState(1);

    useEffect(() => {
        changeState();
        getListProductos()
            .then((res) => {
                setProductos(res);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                changeState();
            });
    }, []);

    return (
        <div className='mt-4'>
            <div>
                <h1 className='text-center mb-3'>Menú de Productos</h1>
                <div style={{ marginTop: '30px', margin: '0 auto', width: '90%' }} className='d-flex justify-content-end mb-2 aling-items-center'>
                    <h5 className='mx-2'>Mostrar:</h5>
                    <div>
                        <select onChange={(e) => setSelectedType(parseInt(e.target.value))} className='form-control color-Style'>
                            <option value='-1'>Todos</option>
                            <option value='1'>Comidas</option>
                            <option value='2'>Bebidas</option>
                        </select>
                    </div>
                </div>
            </div>
            <TableContainer component={Paper} elevation={2} style={{ marginTop: '30px', margin: '0 auto', width: '90%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productos.map((elem, index) => {
                            if (selectedType === 2 && (elem.tipo === 2 || elem.tipo === 3)) {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{elem.nombre}</TableCell>
                                        <TableCell>{`$${elem.precio}`}</TableCell>
                                    </TableRow>
                                )
                            }
                            if (elem.tipo === selectedType || selectedType === -1)
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{elem.nombre}</TableCell>
                                        <TableCell>{`$${elem.precio}`}</TableCell>
                                    </TableRow>
                                )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default MenuProductos;
