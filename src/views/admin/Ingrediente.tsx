import { useEffect, useState } from 'react';
import '../../styles/ingrediente.css';
import spinnerStore from '../../state/spinner';
import { Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import { useSnackbar } from 'notistack';
import { DtIngrediente } from '../../dataTypes/DtIngrediente';
import { DtCategoria } from '../../dataTypes/DtCategoria';
import { actualizarIngrediente, agregarIngrediente, listarIngredientes } from '../../api/ingrediente';
import { listarCategorias } from '../../api/categoria';


const Ingrediente = () => {
	const { changeState } = spinnerStore();
	const [ingredientes, setIngredientes] = useState<DtIngrediente[]>([]);
    const [categorias, setCategorias] = useState<DtCategoria[]>([]);
    const [id_Ingrediente,setId]= useState('');
    const [nombre,setNombre]= useState('');
    const [stock,setStock]= useState('');
    const [id_Categoria,setCategoria]= useState('');
    const [title,setTitle]= useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIngredientes, setFilteredIngredientes] = useState<DtIngrediente[]>([]);
    const [searchResults, setSearchResults] = useState(true);
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        setFilteredIngredientes(ingredientes.filter(elem => elem.nombre.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, ingredientes]);

	useEffect(() => {
        controlModal('modalIngredientes', 'cerrar');
        controlModal('modalIngredientes2', 'cerrar');
		changeState();

        listarCategorias()
        .then((res) => {
            setCategorias(res);
        })
	    // Si la barra de búsqueda está vacía, carga todos los Ingredientes
        listarIngredientes()
        .then((res) => {
            setIngredientes(res);
            setFilteredIngredientes(res);
            setSearchResults(true); // Se encontraron resultados
        })
        .catch((err) => console.log(err))
        .finally(() => {
            setSearchResults(true); // Finaliza la búsqueda
            changeState();
        });
    }, []);

    const obtenerIngredientes = () => {
        listarIngredientes()
            .then((res) => {
            setIngredientes(res);
            setFilteredIngredientes(res);
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
        setId(id_Ingrediente.toString());
        setNombre(nombre);
        setStock(stock);
        setCategoria(id_Categoria);
        setTitle('Editar Ingrediente');
        controlModal('modalIngredientes', 'abrir');
        controlModal('modalIngredientes2', 'cerrar');
    };
      
    const openModal2 = () => {
        setNombre('');
        setStock('0');
        setCategoria('0');
        setTitle('Registrar Ingrediente');
        controlModal('modalIngredientes3', 'abrir');
    };

    const crearIngrediente = async (nombre: string, stock: string, id_Categoria: string) => {
        setId('0');
        if(nombre.trim() === ''){
            enqueueSnackbar('Escribe el nombre del Ingrediente', { variant: 'warning' })
        }
        else if(id_Categoria.trim() === ''){
            enqueueSnackbar('Seleccione la categoria del Ingrediente', { variant: 'warning' })
        }
        else{
            const aux: DtIngrediente = {
                id_Ingrediente: 0,
                nombre,
                stock: parseInt(stock),
                id_Categoria: parseInt(id_Categoria)
            };
            try {
                const response = await agregarIngrediente(aux);
                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    obtenerIngredientes();
                    setNombre('');
                    setStock('');
                    setCategoria('');
                } else {
                    enqueueSnackbar(response.statusMessage, { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })
                
            }
        }
    }

    const modificarIngrediente = async (nombre: string, stock: string, id_Categoria: string) => {
        if(nombre.trim() === ''){
            enqueueSnackbar('Escribe el nombre del Ingrediente', { variant: 'warning' })
        }
        else if(id_Categoria.trim() === ''){
            enqueueSnackbar('Seleccione la Categoria del Ingrediente', { variant: 'warning' })
        }
        else{
            const aux: DtIngrediente = {
                id_Ingrediente: parseInt(id_Ingrediente),
                nombre,
                stock: parseInt(stock),
                id_Categoria: parseInt(id_Categoria)
            };
    
            try {
                const response = await actualizarIngrediente(aux);
                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    obtenerIngredientes();
                } else {
                    enqueueSnackbar(response.statusMessage, { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })
            }
        }
    }

    /*const deleteIngrediente= async () =>{
        try {
            const response = await eliminarIngrediente(parseInt(id_Ingrediente));
            if (response.statusOk === true) {
                const btnCerrar = document.getElementById('btnCerrar');
                if (btnCerrar) {
                    btnCerrar.click();
                }
                enqueueSnackbar(response.statusMessage, { variant: 'success' })
                obtenerIngredientes();
                controlModal('modalIngredientes2', 'cerrar');
            } else {
                enqueueSnackbar(response.statsMessage, { variant: 'error' })
            }
        } catch (error) {
            enqueueSnackbar('Error inesperado', { variant: 'error' })
        }
    }*/

    const verIngrediente = (id_Ingrediente: number, nombre: string, stock: number, id_Categoria: number) =>{
        setId(id_Ingrediente.toString());
        setNombre(nombre);
        setStock(stock.toString());
        setCategoria(id_Categoria.toString());
        setTitle('Información del Ingrediente');
        controlModal('modalIngredientes2', 'abrir');
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='mt-3'>
                <div className='mt-3 d-flex justify-content-end'>
                    <button onClick={() => openModal2()} className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalIngredientes'>
                    <i className='fa-solid fa-circle-plus'></i> Añadir
                    </button>
                </div>  
            </div>
            <div className='mt-3'>
                <div className='d-flex justify-content-start align-items-center'>
                    <input type="text" id='busqueda' placeholder="Buscar Ingredientes" value={searchTerm}
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
								  <TableCell>Stock</TableCell>
								</TableRow>
							  </TableHead>
							  <TableBody>
								{filteredIngredientes.map((elem, index) => (
								  <TableRow key={index}>
									<TableCell>{elem.nombre}</TableCell>
									<TableCell>{elem.stock}</TableCell>
									<TableCell>
									   <Button size="small" style={{ marginRight: '5px'}} color="primary" onClick={() => verIngrediente(elem.id_Ingrediente,elem.nombre,elem.stock,elem.id_Categoria)}>
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
        <div id='modalIngredientes' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                            <span className='input-group-text'>Stock<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='stock' className='form-control' value={stock}
                            onChange={(e)=> setStock(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Categoria<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                id='categoria'
                                className='form-control'
                                value={id_Categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                >
                                {categorias.map((cat) => (
                                    <option key={cat.id_Categoria} value={cat.id_Categoria}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <Button onClick={() => modificarIngrediente(nombre, stock, id_Categoria)} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </Button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <Button onClick={() => controlModal('modalIngredientes', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalIngredientes2' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                            <span className='input-group-text'>Stock<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='stock' className='form-control' value={stock}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Categoria<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                id='categoria'
                                className='form-control'
                                value={id_Categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                disabled
                                >
                                {categorias.map((cat) => (
                                    <option key={cat.id_Categoria} value={cat.id_Categoria}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => openModal()}>
                            Modificar
                        </Button>
                        &nbsp; 
                        {/*<Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={()=>deleteIngrediente()}>
                            Eliminar
                        </Button>*/}
                        <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => controlModal('modalIngredientes2', 'cerrar')} type='button' id='btnCerrar'>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalIngredientes3' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                            <span className='input-group-text'>Stock<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='stock' className='form-control' value={stock}
                            onChange={(e)=> setStock(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Categoria<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                id='categoria'
                                className='form-control'
                                value={id_Categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                >
                                {categorias.map((cat) => (
                                    <option key={cat.id_Categoria} value={cat.id_Categoria}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>       
                        <div className='d-grid col-6 mx-auto'>
                            <Button onClick={() => crearIngrediente(nombre, stock, id_Categoria)} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </Button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <Button onClick={() => controlModal('modalIngredientes3', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Ingrediente
