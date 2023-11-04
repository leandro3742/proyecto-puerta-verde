import { useEffect, useState } from 'react';
import '../../styles/usuario.css';
import spinnerStore from '../../state/spinner';
import { Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useSnackbar } from 'notistack';
import { eliminarRol, listarUsuarios, agregarUsuario, actualizarUsuario, eliminarUsuario, agregarRolUsuario, listarRoles } from '../../api/usuario';
import { DtUsuario } from '../../dataTypes/DtUsuario';
import { DtUsuarioRol } from '../../dataTypes/DtUsuarioRol';
import { DtRolClave } from '../../dataTypes/DtRolClave';

const Usuario = () => {
    const { changeState } = spinnerStore();
    const [usuarios, setUsuarios] = useState<DtUsuario[]>([]);
    const [roles, setRoles] = useState<DtRolClave[]>([])
    const [roles2, setRoles2] = useState<DtRolClave[]>([]);
    const [roles3, setRoles3] = useState<DtRolClave[]>([]);
    const [roles4, setRoles4] = useState<DtRolClave[]>([]);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');
    const [title, setTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsuarios, setFilteredUsuarios] = useState<DtUsuario[]>([]);
    const [searchResults, setSearchResults] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setFilteredUsuarios(usuarios.filter(elem => elem.nombre.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, usuarios]);

    useEffect(() => {
        if (roles4.length > 0) {
            setRol(String(roles4[0].id));
        }
    }, [roles4]);

    useEffect(() => {
        roles4.splice(0, roles4.length);
        const rolesNoEnRoles = roles3.filter((rol3) => !roles.some((rol) => rol.nombre === rol3.nombre));
        setRoles4([...rolesNoEnRoles]);
    }, [roles4]);

    useEffect(() => {
        controlModal('modalUsuarios', 'cerrar');
        controlModal('modalUsuarios2', 'cerrar');
        changeState();

        setRoles3([{ id: 1, nombre: 'USER' }, { id: 2, nombre: 'ADMIN' }, { id: 3, nombre: 'COCINA' }, { id: 4, nombre: 'CAJA' }, { id: 5, nombre: 'MOZO' }]);
        // Si la barra de búsqueda está vacía, carga todos los Usuarios
        listarUsuarios()
            .then((res) => {
                setUsuarios(res);
                setFilteredUsuarios(res);
                setSearchResults(true); // Se encontraron resultados
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setSearchResults(true); // Finaliza la búsqueda
                changeState();
            });
    }, []);

    const obtenerUsuarios = () => {
        listarUsuarios()
            .then((res) => {
                setUsuarios(res);
                setFilteredUsuarios(res);
            });
    };

    const obtenerRoles = (email: string) => {
        listarRoles(email)
            .then((res) => {
                setRoles(res);
            });
    };

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

    const openModalAddRoles = () => {
        setNombre(nombre);
        setApellido(apellido);
        setEmail(email);
        setPassword(password);
        setTitle('Agregar Rol al Usuario');
        controlModal('modalUsuarios4', 'abrir');
        controlModal('modalUsuarios2', 'cerrar');
    };

    const openModal = () => {
        setNombre(nombre);
        setApellido(apellido);
        setEmail(email);
        setPassword(password);
        setTitle('Editar Usuario');
        controlModal('modalUsuarios', 'abrir');
        controlModal('modalUsuarios2', 'cerrar');
    };

    const openModal2 = () => {
        setNombre('');
        setApellido('');
        setEmail('');
        setPassword('');
        setTitle('Registrar Usuario');
        controlModal('modalUsuarios3', 'abrir');
    };

    const crearUsuario = async (nombre: string, apellido: string, email: string, password: string) => {
        if (nombre.trim() === '') {
            enqueueSnackbar('Escribe el nombre del Usuario', { variant: 'warning' })
        } else if (apellido.trim() === '') {
            enqueueSnackbar('Escribe el apellido del Usuario', { variant: 'warning' })
        } else if (email.trim() === '0') {
            enqueueSnackbar('Escribe el Mail del Usuario', { variant: 'warning' })
        }
        else if (password.trim() === '') {
            enqueueSnackbar('Escribe una password para el Usuario', { variant: 'warning' })
        }
        else {
            const aux: DtUsuario = {
                nombre,
                apellido,
                email,
                password
            };
            try {
                const response = await agregarUsuario(aux);

                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    setNombre('');
                    setApellido('');
                    setEmail('');
                    setPassword('');
                    obtenerUsuarios();
                } else {
                    enqueueSnackbar(response.statusMessage, { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })

            }
        }
    }

    const modificarUsuario = async (nombre: string, apellido: string, email: string, password: string) => {
        if (nombre.trim() === '') {
            enqueueSnackbar('Escribe el nombre del Usuario', { variant: 'warning' })
        } else if (apellido.trim() === '') {
            enqueueSnackbar('Escribe el apellido del Usuario', { variant: 'warning' })
        }
        else {
            const aux: DtUsuario = {
                nombre,
                apellido,
                email,
                password
            };

            try {
                const response = await actualizarUsuario(aux);
                if (response.statusOk === true) {
                    for(const elemento of roles2){
                        if(elemento.id == 1){
                            enqueueSnackbar('El Rol USER es generico y no debe eliminarse ', { variant: 'warning' })
                        }else{
                            const aux3: DtUsuarioRol = {
                                roleName: elemento.nombre,
                                userName: email
                            };
                            await eliminarRol(aux3);
                        }
                    }
                    roles2.splice(0, roles2.length);
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    obtenerUsuarios();
                } else {
                    enqueueSnackbar(response.statusMessage, { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })
            }
        }
    }

    const deleteUsuario = async () => {
        try {
            const response = await eliminarUsuario(email);
            if (response.statusOk === true) {
                const btnCerrar = document.getElementById('btnCerrar');
                if (btnCerrar) {
                    btnCerrar.click();
                }
                enqueueSnackbar(response.statusMessage, { variant: 'success' })
                obtenerUsuarios();
                controlModal('modalUsuarios2', 'cerrar');
            } else {
                enqueueSnackbar(response.statsMessage, { variant: 'error' })
            }
        } catch (error) {
            enqueueSnackbar('Error inesperado', { variant: 'error' })
        }
    }

    const verUsuarios = (nombre: string, apellido: string, email: string, password: string) => {
        obtenerRoles(email);
        setNombre(nombre);
        setApellido(apellido);
        setEmail(email);
        setPassword(password);

        setTitle('Información del Usuasrio');
        controlModal('modalUsuarios2', 'abrir');
    };

    const agregarRol = async (rolid: string, email: string) => {
        try {
            const elemento = roles3.find((rol) => rol.id === parseInt(rolid));
            if (elemento) {
                const aux: DtUsuarioRol = {
                    roleName: elemento.nombre,
                    userName: email,
                };
                const response = await agregarRolUsuario(aux);

                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    obtenerRoles(email);
                } else {
                    enqueueSnackbar(response.statsMessage, { variant: 'error' })
                }
            }
        } catch (error) {
            enqueueSnackbar('Error inesperado', { variant: 'error' })
        }
    };

    const eliminarItem = (itemRol: number) => {
        const rolEliminado = roles.find((rol) => rol.id === itemRol);

        if (rolEliminado) {
            const nuevaListaRoles = roles.filter((rol) => rol.id !== itemRol);
            const nuevaListaRoles2 = [...roles2, rolEliminado];

            setRoles(nuevaListaRoles);
            setRoles2(nuevaListaRoles2);
            console.log(rolEliminado.nombre);
        }
    };

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='mt-3'>
                    <div className='mt-3 d-flex justify-content-end'>
                        <button onClick={() => openModal2()} className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalUsuarios'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
                <div className='mt-3'>
                    <div className='d-flex justify-content-start align-items-center'>
                        <input type="text" id='busqueda' placeholder="Buscar Usuarios" value={searchTerm}
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
                                            <TableCell>Email</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsuarios.map((elem, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{elem.nombre + " " + elem.apellido}</TableCell>
                                                <TableCell>{elem.email}</TableCell>
                                                <TableCell>
                                                    <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => verUsuarios(elem.nombre, elem.apellido, elem.email, elem.password)}>
                                                        Ver
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
            <div id='modalUsuarios' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Apellido<i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='apellido' className='form-control color-Style' value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}></input>
                            </div>
                            <div className='divComboRol'>
                                {roles.map((itemRol) => (
                                    <div className='itemRol' key={itemRol.id}>
                                        <label className='listaRoles'>{itemRol.nombre}</label>
                                        <span className='iconoEliminar' onClick={() => eliminarItem(itemRol.id)}>
                                            <div className='circuloRojo'>
                                                X
                                            </div>
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <Button onClick={() => modificarUsuario(nombre, apellido, email, password)} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </Button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <Button onClick={() => controlModal('modalUsuarios', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalUsuarios2' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className='modal-dialog'>
                    <div className='modal-content' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id' value={nombre}></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Nombre<i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='nombre' className='form-control color-Style' value={nombre}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Apellido<i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='apellido' className='form-control color-Style' value={apellido}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Email<i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='email' className='form-control color-Style' value={email}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Roles adquiridos<i className='fa-solid fa-dollar-sign'></i></span>
                                <div className='divComboRol'>
                                    {roles.map((itemRol) => (
                                        <div key={itemRol.id}>
                                            <label className='listaRoles'>{itemRol.nombre}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => openModal()}>
                                Modificar
                            </Button>
                            <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => openModalAddRoles()}>
                                Agregar Rol
                            </Button>
                            &nbsp;
                            <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => deleteUsuario()}>
                                Eliminar
                            </Button>
                            <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => controlModal('modalUsuarios2', 'cerrar')} type='button' id='btnCerrar'>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalUsuarios3' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Apellido<i className='fa-solid fa-gift'></i></span>
                                <input type='text' id='apellido' className='form-control color-Style' value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Email<i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='email' className='form-control color-Style' value={email}
                                    onChange={(e) => setEmail(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Password<i className='fa-solid fa-comment'></i></span>
                                <input type='text' id='password' className='form-control color-Style' value={password}
                                    onChange={(e) => setPassword(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <Button onClick={() => crearUsuario(nombre, apellido, email, password)} className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </Button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <Button onClick={() => controlModal('modalUsuarios3', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalUsuarios4' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className='modal-dialog'>
                    <div className='modal-content' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                        </div>
                        <div className='modal-body'>
                            <div className='input-group mb-3'>
                                {roles4.length > 0 && (
                                    <span className='input-group-text'>Rol<i className='fa-solid fa-dollar-sign'></i></span>
                                )}
                                {roles4.length === 0 ? (
                                    <div>
                                        <label>El usuario ya posee todos los roles de sistema asignados</label>
                                    </div>
                                ) : (
                                    <select
                                        id='tipo'
                                        className='form-control color-Style'
                                        value={rol}
                                        onChange={(e) => setRol(e.target.value)}
                                    >
                                        {roles4.map((role, index) => (
                                            <option key={index} value={role.id}>
                                                {role.nombre}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                {roles4.length > 0 && (
                                    <Button onClick={() => agregarRol(rol, email)} className='btn btn-success'>
                                        <i className='fa-solid fa-floppy-disk'></i> Guardar
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => controlModal('modalUsuarios4', 'cerrar')} type='button' id='btnCerrar'>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Usuario

