import { useEffect, useState } from 'react';
// import '../../styles/mesa.css';
import { agregarMesa, bajaMesa, getListMesa } from '../../api/mesa';
import spinnerStore from '../../state/spinner';
import { Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useSnackbar } from 'notistack';
import { DtMesa } from '../../dataTypes/DtMesa';


const Mesas = () => {
    const { changeState } = spinnerStore();
    const [mesas, setMesas] = useState<DtMesa[]>([]);
    const [nombre, setNombre] = useState('');
    const [title, setTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMesas, setFilteredMesas] = useState<DtMesa[]>([]);
    const [searchResults, setSearchResults] = useState(true);
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        setFilteredMesas(mesas.filter(elem => elem.nombre.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, mesas]);

    useEffect(() => {
        controlModal('modalMesas', 'cerrar');
        controlModal('modalMesas2', 'cerrar');
        changeState();
        // Si la barra de búsqueda está vacía, carga todos los clientes
        getListMesa()
            .then((res) => {
                setMesas(res);
                setFilteredMesas(res);
                setSearchResults(true); // Se encontraron resultados
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setSearchResults(true); // Finaliza la búsqueda
                changeState();
            });
    }, []);

    const obtenerMesas = () => {
        getListMesa()
            .then((res) => {
                setMesas(res);
                setFilteredMesas(res);
            });
    };

    const controlModal = (modal: string, accion: string) => {
        const elemento = document.getElementById(modal);
        if (elemento) { // Verificar si elemento no es null
            if (accion === 'abrir') {
                elemento.classList.add('show');
                elemento.style.display = 'block';
            } else if (accion === 'cerrar') {
                elemento.classList.remove('show');
                elemento.style.display = 'none';
            }
        }
    };

    const openModal2 = () => {
        setNombre('');
        setTitle('Registrar Mesa');
        controlModal('modalMesas3', 'abrir');
    };

    const crearMesa = async (nombre: string) => {
        if (nombre.trim() === '') {
            enqueueSnackbar('Escribe el nombre de la Mesa', { variant: 'warning' })
        }
        else {
            const idMesa = 0;
            const aux: DtMesa = {
                id_Mesa: idMesa.toString(),
                nombre,
                enUso: false,
                precioTotal: 0
            };
            try {
                const response = await agregarMesa(aux);
                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    obtenerMesas();
                    setNombre('');
                } else {
                    enqueueSnackbar(response.statusMessage, { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })

            }
        }
    }

    const deleteMesa = async (id: string) => {
        try {
            const response = await bajaMesa(parseInt(id));
            if (response.statusOk === true) {
                const btnCerrar = document.getElementById('btnCerrar');
                if (btnCerrar) {
                    btnCerrar.click();
                }
                enqueueSnackbar(response.statusMessage, { variant: 'success' })
                obtenerMesas();
                controlModal('modalMesas2', 'cerrar');
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
                        <button onClick={() => openModal2()} className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalMesas'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
                <div className='mt-3'>
                    <div className='d-flex justify-content-start align-items-center'>
                        <input type="text" id='busqueda' placeholder="Buscar clientes" value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input form-control"
                        ></input>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <TableContainer component={Paper} elevation={2} style={{ marginTop: '30px', margin: '0 auto', width: '90%' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Accion</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredMesas.map((elem, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{elem.nombre}</TableCell>
                                                <TableCell>{elem.enUso ? "En uso" : "Libre"}</TableCell>
                                                <TableCell>
                                                    <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => deleteMesa(elem.id_Mesa)}>
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
                <div style={{ marginLeft: '550px', marginTop: '10px' }}>
                    {!searchResults && <p>No se encontraron resultados.</p>}
                </div>
            </div>
            <div id='modalMesas3' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className='modal-dialog'>
                    <div className='modal-content' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Nombre<i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control color-Style' value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <Button onClick={() => crearMesa(nombre)} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </Button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <Button onClick={() => controlModal('modalMesas3', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mesas
