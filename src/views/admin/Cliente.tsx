import { useEffect, useState } from 'react';
import '../../styles/cliente.css';
import { agregarCliente, eliminarCliente, actualizarCliente, listarClientes } from '../../api/cliente';
import { DtCliente } from '../../dataTypes/DtCliente';
import spinnerStore from '../../state/spinner';
import { Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import { useSnackbar } from 'notistack';
import ficha from '../../assets/ficha.png'


const Cliente = () => {
	const { changeState } = spinnerStore();
	const [clientes, setClientes] = useState<DtCliente[]>([]);
    const [id_Cli_Preferencial,setId]= useState('');
    const [nombre,setNombre]= useState('');
    const [apellido,setApellido]= useState('');
    const [telefono,setTelefono]= useState('');
	const [saldo,setSaldo]= useState('');
	const [fichasCanje,setFichas]= useState('');
    const [title,setTitle]= useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClientes, setFilteredClientes] = useState<DtCliente[]>([]);
    const [searchResults, setSearchResults] = useState(true);
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        setFilteredClientes(clientes.filter(elem => elem.nombre.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, clientes]);

	useEffect(() => {
        controlModal('modalClientes', 'cerrar');
        controlModal('modalClientes2', 'cerrar');
		changeState();
	    // Si la barra de búsqueda está vacía, carga todos los clientes
        listarClientes()
        .then((res) => {
            setClientes(res);
            setFilteredClientes(res);
            setSearchResults(true); // Se encontraron resultados
        })
        .catch((err) => console.log(err))
        .finally(() => {
            setSearchResults(true); // Finaliza la búsqueda
            changeState();
        });
    }, []);

    const obtenerClientes = () => {
        listarClientes()
            .then((res) => {
            setClientes(res);
            setFilteredClientes(res);
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

    const openModal = () => {
        setId(id_Cli_Preferencial.toString());
        setNombre(nombre);
        setApellido(apellido);
        setTelefono(telefono);
        setSaldo(saldo.toString());
        setFichas(fichasCanje.toString());
        setTitle('Editar Cliente');
        controlModal('modalClientes', 'abrir');
        controlModal('modalClientes2', 'cerrar');
    };
      
    const openModal2 = () => {
        setNombre('');
        setApellido('');
        setTelefono('');
        setSaldo('0');
        setFichas('0');
        setTitle('Registrar Cliente');
        controlModal('modalClientes3', 'abrir');
    };

    const crearCliente = async (nombre: string, apellido: string, telefono: string, saldo: string, fichasCanje: string) => {
        setId('0');
        if(nombre.trim() === ''){
            enqueueSnackbar('Escribe el nombre del Cliente', { variant: 'warning' })
        }
		else if(apellido.trim() === ''){
            enqueueSnackbar('Escribe el apellido del Cliente', { variant: 'warning' })
        }
        else if(telefono.trim() === ''){
            enqueueSnackbar('Escribe el telefono del Cliente', { variant: 'warning' })
        }
        else{
            const aux: DtCliente = {
                id_Cli_Preferencial: 0,
                nombre,
                apellido,
                telefono,
                saldo: parseFloat(saldo), // Convierte saldo a número
                registro_Activo: true,
                fichasCanje: parseInt(fichasCanje), // Convierte fichasCanje a número entero
            };
            try {
                const response = await agregarCliente(aux);
                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    obtenerClientes();
                    setNombre('');
                    setApellido('');
                    setTelefono('');
                    setSaldo('');
                    setFichas('');
                } else {
                    enqueueSnackbar(response.statusMessage, { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })
                
            }
        }
    }

    const modificarCliente = async (nombre: string, apellido: string, telefono: string, saldo: string, fichasCanje: string) => {
        if(nombre.trim() === ''){
            enqueueSnackbar('Escribe el nombre del Cliente', { variant: 'warning' })
        }
		else if(apellido.trim() === ''){
            enqueueSnackbar('Escribe el apellido del Cliente', { variant: 'warning' })
        }
        else if(telefono.trim() === ''){
            enqueueSnackbar('Escribe el telefono del Cliente', { variant: 'warning' })
        }
        else{
            const aux: DtCliente = {
                id_Cli_Preferencial: parseInt(id_Cli_Preferencial),
                nombre,
                apellido,
                telefono,
                saldo: parseFloat(saldo), // Convierte saldo a número
                registro_Activo: true,
                fichasCanje: parseInt(fichasCanje), // Convierte fichasCanje a número entero
            };
    
            try {
                const response = await actualizarCliente(aux);
                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    obtenerClientes();
                } else {
                    enqueueSnackbar(response.statusMessage, { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })
            }
        }
    }

    const deleteCliente= async () =>{
        try {
            const response = await eliminarCliente(parseInt(id_Cli_Preferencial));
            if (response.statusOk === true) {
                const btnCerrar = document.getElementById('btnCerrar');
                if (btnCerrar) {
                    btnCerrar.click();
                }
                enqueueSnackbar(response.statusMessage, { variant: 'success' })
                obtenerClientes();
                controlModal('modalClientes2', 'cerrar');
            } else {
                enqueueSnackbar(response.statsMessage, { variant: 'error' })
            }
        } catch (error) {
            enqueueSnackbar('Error inesperado', { variant: 'error' })
        }
    }

    const verCliente = (id_Cli_Preferencial: number, nombre: string, apellido: string, telefono: string, saldo: number, fichasCanje: number) =>{
        setId(id_Cli_Preferencial.toString());
        setNombre(nombre);
        setApellido(apellido);
        setTelefono(telefono);
        setSaldo(saldo.toString());
        setFichas(fichasCanje.toString());
        setTitle('Información del Cliente');
        controlModal('modalClientes2', 'abrir');
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='mt-3'>
                <div className='mt-3 d-flex justify-content-end'>
                    <button onClick={() => openModal2()} className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalClientes'>
                    <i className='fa-solid fa-circle-plus'></i> Añadir
                    </button>
                </div>  
            </div>
            <div className='mt-3'>
                <div className='d-flex justify-content-start align-items-center'>
                    <input type="text" id='busqueda' placeholder="Buscar clientes" value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
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
								  <TableCell>Saldo</TableCell>
								  <TableCell>Fichas</TableCell>
								  <TableCell>Acciones</TableCell>
								</TableRow>
							  </TableHead>
							  <TableBody>
								{filteredClientes.map((elem, index) => (
								  <TableRow key={index}>
									<TableCell>{elem.nombre + ' ' + elem.apellido}</TableCell>
									<TableCell>{elem.saldo}</TableCell>
                                    <TableCell><img src={ficha} alt="Ficha" className="img-fichas"/>
                                               {" x "+elem.fichasCanje}
                                    </TableCell>
									<TableCell>
									   <Button size="small" style={{ marginRight: '5px'}} color="primary" onClick={() => verCliente(elem.id_Cli_Preferencial,elem.nombre,elem.apellido,elem.telefono,elem.saldo,elem.fichasCanje)}>
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
            <div style={{ marginLeft: '550px', marginTop: '10px'}}>
                {!searchResults && <p>No se encontraron resultados.</p>}
            </div>  
        </div>
        <div id='modalClientes' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className='modal-dialog'>
                <div className='modal-content' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Nombre<i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='nombre' className='form-control' value={nombre}
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Apellido<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='apellido' className='form-control' value={apellido}
                            onChange={(e)=> setApellido(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Telefono<i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='telefono' className='form-control' value={telefono}
                            onChange={(e)=> setTelefono(e.target.value)}></input>
                        </div>
						<div className='input-group mb-3'>
                            <span className='input-group-text'>Saldo<i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='saldo' className='form-control' value={saldo}
                            onChange={(e)=> setSaldo(e.target.value)}></input>
                        </div>
						<div className='input-group mb-3'>
                            <span className='input-group-text'>Fichas<i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='fichasCanje' className='form-control' value={fichasCanje}
                            onChange={(e)=> setFichas(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <Button onClick={() => modificarCliente(nombre, apellido, telefono, saldo, fichasCanje)} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </Button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <Button onClick={() => controlModal('modalClientes', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalClientes2' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className='modal-dialog'>
                <div className='modal-content' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id' value={nombre}></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Nombre<i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='nombre' className='form-control' value={nombre}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Apellido<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='apellido' className='form-control' value={apellido}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Telefono<i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='telefono' className='form-control' value={telefono}></input>
                        </div>
						<div className='input-group mb-3'>
                            <span className='input-group-text'>Saldo<i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='saldo' className='form-control' value={saldo}></input>
                        </div>
						<div className='input-group mb-3'>
                            <span className='input-group-text'>Fichas<i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='fichasCanje' className='form-control' value={fichasCanje}></input>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => openModal()}>
                            Modificar
                        </Button>
                        &nbsp; 
                        <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={()=>deleteCliente()}>
                            Eliminar
                        </Button>
                        <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => controlModal('modalClientes2', 'cerrar')} type='button' id='btnCerrar'>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalClientes3' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className='modal-dialog'>
                <div className='modal-content' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Nombre<i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='nombre' className='form-control' value={nombre}
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Apellido<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='apellido' className='form-control' value={apellido}
                            onChange={(e)=> setApellido(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Telefono<i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='telefono' className='form-control' value={telefono}
                            onChange={(e)=> setTelefono(e.target.value)}></input>
                        </div>
						<div className='input-group mb-3'>
                            <span className='input-group-text'>Saldo<i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='saldo' className='form-control' value={saldo}
                            onChange={(e)=> setSaldo(e.target.value)}></input>
                        </div>
						<div className='input-group mb-3'>
                            <span className='input-group-text'>Fichas<i className='fa-solid fa-dollar-sign'></i></span>
                            <input type='text' id='fichasCanje' className='form-control' value={fichasCanje}
                            onChange={(e)=> setFichas(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <Button onClick={() => crearCliente(nombre, apellido, telefono, saldo, fichasCanje)} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </Button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <Button onClick={() => controlModal('modalClientes3', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Cliente
