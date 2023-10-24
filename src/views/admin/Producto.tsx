import { useEffect, useState } from 'react';
import '../../styles/producto.css';
import spinnerStore from '../../state/spinner';
import { Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Select} from '@mui/material';
import { useSnackbar } from 'notistack';
import { agregarProducto, agregarIngredienteProducto, getListProductos, actualizarProducto, eliminarProducto } from '../../api/productos';
import { DtIngrediente } from '../../dataTypes/DtIngrediente';
import { DtProducto } from '../../dataTypes/DtProducto';
import { listarIngredientes } from '../../api/ingrediente';
import { DtTipo } from '../../dataTypes/DtTipo';


const Ingrediente = () => {
	const { changeState } = spinnerStore();
	const [productos, setProductos] = useState<DtProducto[]>([]);
    const [ingredientes, setIngredientes] = useState<DtIngrediente[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [id_Producto,setId]= useState('');
    const [nombre,setNombre]= useState('');
    const [descripcion,setDescripcion]= useState('');
    const [precio,setPrecio]= useState('');
    const [tipo,setTipo]= useState('');
    const [title,setTitle]= useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProductos, setFilteredProductos] = useState<DtProducto[]>([]);
    const [searchResults, setSearchResults] = useState(true);
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        setFilteredProductos(productos.filter(elem => elem.nombre.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, productos]);

	useEffect(() => {
        controlModal('modalProductos', 'cerrar');
        controlModal('modalProductos2', 'cerrar');
		changeState();

        listarIngredientes()
        .then((res) => {
            setIngredientes(res);
        })
	    // Si la barra de búsqueda está vacía, carga todos los Productos
        getListProductos()
        .then((res) => {
            setProductos(res);
            setFilteredProductos(res);
            setSearchResults(true); // Se encontraron resultados
        })
        .catch((err) => console.log(err))
        .finally(() => {
            setSearchResults(true); // Finaliza la búsqueda
            changeState();
        });
    }, []);

    const obtenerProductos = () => {
        getListProductos()
            .then((res) => {
            setProductos(res);
            setFilteredProductos(res);
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
        setId(id_Producto.toString());
        setNombre(nombre);
        setDescripcion(descripcion);
        setPrecio(precio);
        setTipo(tipo);
        setTitle('Editar Producto');
        controlModal('modalProductos', 'abrir');
        controlModal('modalProductos2', 'cerrar');
    };
      
    const openModal2 = () => {
        setNombre('');
        setDescripcion('');
        setPrecio('0');
        setTipo('0');
        setTitle('Registrar Producto');
        controlModal('modalProductos3', 'abrir');
    };

    const crearProducto = async (nombre: string, descripcion: string, precio: string, tipo: string, selectedOptions: string[]) => {
        setId('0');
        if(nombre.trim() === ''){
            enqueueSnackbar('Escribe el nombre del Producto', { variant: 'warning' })
        }else if(descripcion.trim() === ''){
            enqueueSnackbar('Escribe la descripcion del Producto', { variant: 'warning' })
        }else if(precio.trim() === '0'){
            enqueueSnackbar('Escribe el precio del Producto', { variant: 'warning' })
        }
        else if(tipo.trim() === ''){
            enqueueSnackbar('Seleccione el tipo de Producto', { variant: 'warning' })
        }
        else{
            const aux: DtProducto = {
                id_Producto: 0,
                nombre,
                descripcion,
                precio: parseInt(precio),
                tipo: parseInt(tipo)
            };
            try {
                const response = await agregarProducto(aux);
                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    obtenerProductos();
                    setNombre('');
                    setDescripcion('');
                    setPrecio('0');
                    setTipo('');
                } else {
                    enqueueSnackbar(response.statusMessage, { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })
                
            }
        }
    }

    const modificarProducto = async (nombre: string, descripcion: string, precio: string, tipo: string, selectedOptions: string[]) => {
        if(nombre.trim() === ''){
            enqueueSnackbar('Escribe el nombre del Producto', { variant: 'warning' })
        }else if(descripcion.trim() === ''){
            enqueueSnackbar('Escribe la descripcion del Producto', { variant: 'warning' })
        }else if(precio.trim() === '0'){
            enqueueSnackbar('Escribe el precio del Producto', { variant: 'warning' })
        }
        else if(tipo.trim() === ''){
            enqueueSnackbar('Seleccione el tipo de Producto', { variant: 'warning' })
        }
        else{
            const aux: DtProducto = {
                id_Producto: parseInt(id_Producto),
                nombre,
                descripcion,
                precio: parseInt(precio),
                tipo: parseInt(tipo)
            };
    
            try {
                const response = await actualizarProducto(aux);
                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(response.statusMessage, { variant: 'success' })
                    obtenerProductos();
                } else {
                    enqueueSnackbar(response.statusMessage, { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })
            }
        }
    }

    const deleteProducto= async () =>{
        try {
            const response = await eliminarProducto(parseInt(id_Producto));
            if (response.statusOk === true) {
                const btnCerrar = document.getElementById('btnCerrar');
                if (btnCerrar) {
                    btnCerrar.click();
                }
                enqueueSnackbar(response.statusMessage, { variant: 'success' })
                obtenerProductos();
                controlModal('modalProductos2', 'cerrar');
            } else {
                enqueueSnackbar(response.statsMessage, { variant: 'error' })
            }
        } catch (error) {
            enqueueSnackbar('Error inesperado', { variant: 'error' })
        }
    }

    const verProductos = (id_Producto: number, nombre: string, descripcion: string, precio: number, tipo: number) =>{
        setId(id_Producto.toString());
        setNombre(nombre);
        setDescripcion(descripcion);
        setPrecio(precio.toString());
        setTipo(tipo.toString());
        setTitle('Información del Producto');
        controlModal('modalProductos2', 'abrir');
    }

  
    const selectedOptionChange = (selected: any) => {
        selectedOptions.push(selected);
        console.log("Lo que se selecciona es esto: "+selectedOptions);
    };

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='mt-3'>
                <div className='mt-3 d-flex justify-content-end'>
                    <button onClick={() => openModal2()} className='btn btn-success' data-bs-toggle='modal' data-bs-target='#modalProductos'>
                    <i className='fa-solid fa-circle-plus'></i> Añadir
                    </button>
                </div>  
            </div>
            <div className='mt-3'>
                <div className='d-flex justify-content-start align-items-center'>
                    <input type="text" id='busqueda' placeholder="Buscar Productos" value={searchTerm}
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
								  <TableCell>Precio</TableCell>
								</TableRow>
							  </TableHead>
							  <TableBody>
								{filteredProductos.map((elem, index) => (
								  <TableRow key={index}>
									<TableCell>{elem.nombre}</TableCell>
									<TableCell>{elem.precio}</TableCell>
									<TableCell>
									   <Button size="small" style={{ marginRight: '5px'}} color="primary" onClick={() => verProductos(elem.id_Producto,elem.nombre,elem.descripcion,elem.precio,elem.tipo)}>
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
        <div id='modalProductos' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                            <span className='input-group-text'>Descripcion<i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='descripcion' className='form-control' value={descripcion}
                            onChange={(e)=> setDescripcion(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Precio<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='precio' className='form-control' value={precio}
                            onChange={(e)=> setPrecio(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Tipo<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                id='tipo'
                                className='form-control'
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                >
                                {Object.entries(DtTipo).map(([key, value]) => {
                                    return (
                                        <option key={key} value={key}>{value}</option>        
                                    )
                                })}    
                            </select>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Ingredientes<i className='fa-solid fa-dollar-sign'></i></span>
                            <Select
                                multiple
                                id='ingredientes'
                                className='form-control'
                                value={selectedOptions}
                                onChange={(e) => selectedOptionChange(e.target.value)}
                                renderValue={(selected) => (
                                    <div>
                                    {selected.map((value) => (
                                        <span key={value}>{value}, </span>
                                    ))}
                                    </div>
                                )}

                                >
                                {ingredientes.map((ing) => (
                                    <option key={ing.id_Ingrediente} value={ing.id_Ingrediente}>
                                        {ing.nombre}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <Button onClick={() => modificarProducto(nombre, descripcion, precio, tipo, selectedOptions)} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </Button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <Button onClick={() => controlModal('modalProductos', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalProductos2' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                            <span className='input-group-text'>Descripcion<i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='descripcion' className='form-control' value={descripcion}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Precio<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='precio' className='form-control' value={precio}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Tipo<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                id='tipo'
                                className='form-control'
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                disabled
                                >
                                {Object.entries(DtTipo).map(([key, value]) => {
                                    return (
                                        <option key={key} value={key}>{value}</option>        
                                    )
                                })}
                            </select>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Ingredientes<i className='fa-solid fa-dollar-sign'></i></span>
                            <Select
                                multiple
                                id='ingredientes'
                                className='form-control'
                                value={selectedOptions}
                                onChange={(e) => selectedOptionChange(e.target.value)}
                                disabled
                                renderValue={(selected) => (
                                    <div>
                                    {selected.map((value) => (
                                        <span key={value}>{value}, </span>
                                    ))}
                                    </div>
                                )}

                                >
                                {ingredientes.map((ing) => (
                                    <option key={ing.id_Ingrediente} value={ing.id_Ingrediente}>
                                        {ing.nombre}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => openModal()}>
                            Modificar
                        </Button>
                        &nbsp; 
                        <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={()=>deleteProducto()}>
                            Eliminar
                        </Button>
                        <Button size="small" style={{ marginRight: '5px' }} color="primary" onClick={() => controlModal('modalProductos2', 'cerrar')} type='button' id='btnCerrar'>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalProductos3' className='modal fade' aria-hidden='true' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
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
                            <span className='input-group-text'>Descripcion<i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='descripcion' className='form-control' value={descripcion}
                            onChange={(e)=> setDescripcion(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Precio<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='precio' className='form-control' value={precio}
                            onChange={(e)=> setPrecio(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Tipo<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                id='tipo'
                                className='form-control'
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                >
                                {Object.entries(DtTipo).map(([key, value]) => {
                                    return (
                                        <option key={key} value={key}>{value}</option>        
                                    )
                                })}
                            </select>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Ingredientes<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                multiple
                                id='ingredientes'
                                className='form-control'
                                value={selectedOptions}
                                onChange={(e) => selectedOptionChange(e.target.value)}
                                /*renderValue={(selected) => (
                                    <div>
                                    {selected.map((value) => (
                                        <span key={value}>{value}, </span>
                                    ))}
                                    </div>
                                )}*/

                                >
                                {ingredientes.map((ing) => (
                                    <option key={ing.id_Ingrediente} value={ing.id_Ingrediente}>
                                        {ing.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>       
                        <div className='d-grid col-6 mx-auto'>
                            <Button onClick={() => crearProducto(nombre, descripcion, precio, tipo, selectedOptions)} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </Button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <Button onClick={() => controlModal('modalProductos3', 'cerrar')} type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>
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
