import { useEffect, useState } from 'react';
import '../../styles/mesa.css';
import { agregarMesa, bajaMesa, getListMesa } from '../../api/mesa';
import { DtMesa } from '../../dataTypes/DtMesa';
import spinnerStore from '../../state/spinner';
import { Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useSnackbar } from 'notistack';

const Mesas = () => {
    const { changeState } = spinnerStore();
    const [mesas, setMesas] = useState<DtMesa[]>([]);
    const { enqueueSnackbar } = useSnackbar()


    useEffect(() => {

        changeState();
        // Si la barra de búsqueda está vacía, carga todos los clientes
        getListMesa()
            .then((res) => {
                setMesas(res);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                changeState();
            });
    }, []);

    const obtenerMesas = () => {
        getListMesa()
            .then((res) => {
                setMesas(res);
            });
    };

    const crearMesa = async () => {
        const aux: DtMesa = {
            id_Mesa: '0',
            enUso: false,
            precioTotal: 0,
            nombre: 'Mesa'
        };
        try {
            const response = await agregarMesa(aux);
            console.log(response.statusMessage);
            if (response.statusOk === true) {
                enqueueSnackbar(response.statusMessage, { variant: 'success' })
                obtenerMesas();
            } else {
                enqueueSnackbar(response.statusMessage, { variant: 'error' })
            }
        } catch (error) {
            enqueueSnackbar('Error inesperado', { variant: 'error' })

        }
    }

    const deleteCliente = async (idMesa: string) => {
        try {
            const response = await bajaMesa(parseInt(idMesa));
            if (response.statusOk === true) {
                const btnCerrar = document.getElementById('btnCerrar');
                if (btnCerrar) {
                    btnCerrar.click();
                }
                enqueueSnackbar(response.statusMessage, { variant: 'success' })
                obtenerMesas();
            } else {
                enqueueSnackbar(response.statsMessage, { variant: 'error' })
            }
        } catch (error) {
            enqueueSnackbar('Error inesperado', { variant: 'error' })
        }
    }


    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='mt-3'>
                    <div className='mt-3 d-flex justify-content-end'>
                        <button onClick={() => crearMesa()} className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalClientes'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <TableContainer component={Paper} elevation={2} style={{ marginTop: '30px', margin: '0 auto', width: '90%' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Numero</TableCell>
                                            <TableCell>En Uso</TableCell>
                                            <TableCell>Accion</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {mesas.map((elem, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{elem.id_Mesa}</TableCell>
                                                <TableCell>{elem.enUso ? "Sí" : "No"}</TableCell>
                                                <TableCell>
                                                    &nbsp;
                                                    <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => deleteCliente(elem.id_Mesa)}>
                                                        Eliminar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mesas
