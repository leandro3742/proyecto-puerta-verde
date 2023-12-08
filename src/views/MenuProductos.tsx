import React, { useEffect, useState } from 'react';
import '../styles/producto.css';
import spinnerStore from '../state/spinner';
import { Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { getListProductos } from '../api/productos';
import { DtProducto } from '../dataTypes/DtProducto';

const MenuProductos = () => {
    const { changeState } = spinnerStore();
    const [productos, setProductos] = useState<DtProducto[]>([]);
    const [selectedType, setSelectedType] = useState(1);

    useEffect(() => {
        controlModal('modalProductos', 'cerrar');
        controlModal('modalProductos2', 'cerrar');
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

    const controlModal = (modal: string, accion: string) => {
        const elemento = document.getElementById(modal);
        if (elemento) {
            if (accion === 'abrir') {
                elemento.classList.add('show');
                elemento.style.display = 'block';
            } else if (accion === 'cerrar') {
                elemento.classList.remove('show');
                elemento.style.display = 'none';
            }
        }
    };

    const renderProductos = () => {
        const filteredProducts = productos.filter(
            (producto) => selectedType === 1 ? producto.tipo === 1 : producto.tipo === selectedType
        );

        const halfLength = Math.ceil(filteredProducts.length / 2);
        const firstHalf = filteredProducts.slice(0, halfLength);
        const secondHalf = filteredProducts.slice(halfLength);

        return (
            <div className='row mt-3'>
                <div className='col'>
                    <div className='table-responsive'>
                        <TableContainer component={Paper} elevation={2} style={{ marginTop: '30px', margin: '0 auto', width: '90%' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Precio</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {firstHalf.map((elem, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{elem.nombre}</TableCell>
                                            <TableCell>{`$${elem.precio}`}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                <div className='col'>
                    <div className='table-responsive'>
                        <TableContainer component={Paper} elevation={2} style={{ marginTop: '30px', margin: '0 auto', width: '90%' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Precio</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {secondHalf.map((elem, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{elem.nombre}</TableCell>
                                            <TableCell>{`$${elem.precio}`}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        );
    };

    const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedType(Number(event.target.value));
    };

    return (
        <div>
            <div className="d-flex justify-content-between p-2">
                <Button onClick={() => controlModal('modalProductos', 'abrir')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                    Ver Menu
                </Button>
            </div>
            <div id='modalProductos' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog modal-lg d-flex justify-content-center align-items-center'>
                    <div className='modal-content' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className='modal-header'>
                            <label className='h2'>Menu</label>
                        </div>
                        <div className='modal-body'>
                            <div className='mb-3'>
                                <label className='form-label'>Seleccionar Tipo:</label>
                                <select className='form-select' value={selectedType} onChange={handleTypeChange}>
                                    <option value={1}>Comidas</option>
                                    <option value={2}>Bebidas</option>
                                    <option value={3}>Licuados</option>
                                </select>
                            </div>
                            {renderProductos()}
                        </div>
                        <div className='modal-footer'>
                            <Button onClick={() => controlModal('modalProductos', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuProductos;
