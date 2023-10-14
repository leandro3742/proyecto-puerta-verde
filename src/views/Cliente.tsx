import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/cliente.css';
import { agregarCliente, eliminarCliente, actualizarCliente, getListClientes } from '../api/cliente';
import { DtCliente } from '../dataTypes/DtCliente';
import spinnerStore from '../state/spinner';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../functions';
import { Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';


const Cliente = () => {
    const { cliente } = useParams();
	const { changeState } = spinnerStore();
	const [clientes, setClientes] = useState<DtCliente[]>([]);
    const [id_Cli_Preferencial,setId]= useState('');
    const [nombre,setNombre]= useState('');
    const [apellido,setApellido]= useState('');
    const [telefono,setTelefono]= useState('');
	const [saldo,setSaldo]= useState('');
	const [fichasCanje,setFichas]= useState('');
    const [operation,setOperation]= useState(1);
    const [title,setTitle]= useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClientes, setFilteredClientes] = useState<DtCliente[]>([]);
    const [searchResults, setSearchResults] = useState(true);
    
    // Función para filtrar los clientes
    const filterClientes = () => {
        const filteredData = clientes.filter((cliente) => {
            const fullName = cliente.nombre + ' ' + cliente.apellido;
            return fullName.toLowerCase().includes(searchTerm.toLowerCase());
            });

        // Actualiza el estado de búsqueda
        setSearchResults(filteredData.length > 0);

        // Actualiza filteredClientes
        setFilteredClientes(filteredData);
    };

    useEffect(() => {
        filterClientes();
    }, [searchTerm]);

	useEffect(() => {
        const elemento = document.getElementById('modalClientes');
        if (elemento) {
            elemento.classList.remove('show');
            elemento.style.display = 'none';
        }
        const elemento2 = document.getElementById('modalClientes2');
        if (elemento2) {
            elemento2.classList.remove('show');
            elemento2.style.display = 'none';
        }
		changeState();
	    // Si la barra de búsqueda está vacía, carga todos los clientes
        if (searchTerm === '') {
            getListClientes()
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
        }
    }, [searchTerm]);

    const openModal = () => {
        setId(id_Cli_Preferencial.toString());
        setNombre(nombre);
        setApellido(apellido);
        setTelefono(telefono);
        setSaldo(saldo.toString());
        setFichas(fichasCanje.toString());
        setTitle('Editar Cliente');
        const elemento = document.getElementById('modalClientes');
        if (elemento) {
            elemento.classList.add('show');
            elemento.style.display = 'block';
        }
        const elemento2 = document.getElementById('modalClientes2');
        if (elemento2) {
            elemento2.classList.remove('show');
            elemento2.style.display = 'none';
        }
    };
      
    const openModal2 = () => {
        setNombre('');
        setApellido('');
        setTelefono('');
        setSaldo('0');
        setFichas('0');
        setTitle('Registrar Cliente');
        const elemento = document.getElementById('modalClientes3');
        if (elemento) {
            elemento.classList.add('show');
            elemento.style.display = 'block';
        }
    };

    const crearCliente = async (nombre: string, apellido: string, telefono: string, saldo: string, fichasCanje: string) => {
        setId('0');
        if(nombre.trim() === ''){
            show_alerta('Escribe el nombre del Cliente','warning');
        }
		else if(apellido.trim() === ''){
            show_alerta('Escribe el apellido del Cliente','warning');
        }
        else if(telefono.trim() === ''){
            show_alerta('Escribe el telefono del Cliente','warning');
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

            console.log("El cliente es: "+aux.id_Cli_Preferencial+aux.nombre+aux.apellido+aux.telefono+aux.saldo+aux.fichasCanje+aux.registro_Activo)
    
            try {
                const response = await agregarCliente(aux);
                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    show_alerta(response.statusMessage, 'success');
                    getListClientes();
                    setNombre('');
                    setApellido('');
                    setTelefono('');
                    setSaldo('');
                    setFichas('');
                } else {
                    show_alerta(response.statusMessage, 'error');
                }
            } catch (error) {
                show_alerta("Error inesperado", 'error');
            }
        }
    }

    const modificarCliente = async (nombre: string, apellido: string, telefono: string, saldo: string, fichasCanje: string) => {
        if(nombre.trim() === ''){
            show_alerta('Escribe el nombre del Cliente','warning');
        }
		else if(apellido.trim() === ''){
            show_alerta('Escribe el apellido del Cliente','warning');
        }
        else if(telefono.trim() === ''){
            show_alerta('Escribe el telefono del Cliente','warning');
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
                    show_alerta(response.statusMessage, 'success');
                    getListClientes();
                } else {
                    show_alerta(response.statusMessage, 'error');
                }
            } catch (error) {
                show_alerta("Error inesperado", 'error');
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
                show_alerta(response.statusMessage, 'success');
                getListClientes();
            } else {
                show_alerta(response.statusMessage, 'error');
            }
        } catch (error) {
            show_alerta("Error inesperado", 'error');
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
        const elemento = document.getElementById('modalClientes2');
        if (elemento) {
            elemento.classList.add('show');
            elemento.style.display = 'block';
        }
    }

    const cerrarModal = (modal: number) =>{
        if(modal === 1){
            const elemento = document.getElementById('modalClientes');
            if (elemento) {
                elemento.classList.remove('show');
                elemento.style.display = 'none';
            }
        }else  if(modal === 2){
            const elemento = document.getElementById('modalClientes2');
            if (elemento) {
                elemento.classList.remove('show');
                elemento.style.display = 'none';
            }
        }else  if(modal === 3){
            const elemento = document.getElementById('modalClientes3');
            if (elemento) {
                elemento.classList.remove('show');
                elemento.style.display = 'none';
            }
        }else{
            const elemento = document.getElementById('modalClientes');
            if (elemento) {
                elemento.classList.remove('show');
                elemento.style.display = 'none';
            }
        }
        
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-6 d-flex justify-content-start align-items-center'>
                    <input type="text" id='busqueda' placeholder="Buscar clientes" value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        className="search-input form-control"
                    ></input>
                </div>
                <div className='col-md-6 d-flex justify-content-end'>
                    <button onClick={() => openModal2()} className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalClientes'>
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
									<TableCell>{elem.fichasCanje}</TableCell>
									<TableCell>
									   <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => verCliente(elem.id_Cli_Preferencial,elem.nombre,elem.apellido,elem.telefono,elem.saldo,elem.fichasCanje)}>
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
                        <Button onClick={() => cerrarModal(1)} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
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
                        <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => cerrarModal(2)} type='button' id='btnCerrar'>
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
                        <Button onClick={() => cerrarModal(3)} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
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
