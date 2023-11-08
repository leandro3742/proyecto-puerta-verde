import { useEffect, useState } from 'react';
import '../../styles/producto.css';
import spinnerStore from '../../state/spinner';
import { Button, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Checkbox, FormControl, MenuItem, Select} from '@mui/material';
import { useSnackbar } from 'notistack';
import { agregarProducto, getListProductos, actualizarProducto, eliminarProducto, listarIngredientesProductos, agregarIngredienteProducto, quitarProductos_Ingredientes} from '../../api/productos';
import { DtIngrediente } from '../../dataTypes/DtIngrediente';
import { DtProducto } from '../../dataTypes/DtProducto';
import { listarIngredientes } from '../../api/ingrediente';
import { DtTipo } from '../../dataTypes/DtTipo';
import { DtProducto_Ingrediente } from '../../dataTypes/DtProducto_Ingrediente';


const Producto = () => {
	const { changeState } = spinnerStore();
	const [productos, setProductos] = useState<DtProducto[]>([]);
    const [ingredientes, setIngredientes] = useState<DtIngrediente[]>([]);
    const [ingredientes2, setIngredientes2] = useState<DtIngrediente[]>([]);
    const [selectedOptions, setSelectedOptions] = useState(new Set<number>());
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

    const obtenerIngredientes = () => {
        listarIngredientes()
        .then((res) => {
            setIngredientes(res);
        })
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
        setIngredientes2([]);
        setSelectedOptions(new Set());
        setTitle('Registrar Producto');
        controlModal('modalProductos3', 'abrir');
    };

    const crearProducto = async (nombre: string, descripcion: string, precio: string, tipo: string) => {
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
        else if(selectedOptions.size === 0){
            enqueueSnackbar('Debe agregar los Ingredientes del Producto', { variant: 'warning' })
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
                const match = response.statusMessage.split('/');
                const numero = parseInt(match[1]);
                selectedOptions.forEach(async (elemento) => {
                    const aux2: DtProducto_Ingrediente = {
                        id_Producto: numero,
                        id_Ingrediente: elemento
                    };
                    await agregarIngredienteProducto(aux2);
                });
                
                if (response.statusOk === true) {
                    const btnCerrar = document.getElementById('btnCerrar');
                    if (btnCerrar) {
                        btnCerrar.click();
                    }
                    enqueueSnackbar(match[0], { variant: 'success' })
                    obtenerProductos();
                    setNombre('');
                    setDescripcion('');
                    setPrecio('0');
                    //setTipo('');
                    setSelectedOptions(new Set());
                    obtenerIngredientes();
                } else {
                    enqueueSnackbar(match[0], { variant: 'error' })
                }
            } catch (error) {
                enqueueSnackbar('Error inesperado', { variant: 'error' })
                
            }
        }
    }

    const modificarProducto = async (nombre: string, descripcion: string, precio: string, tipo: string, ingredientes2: DtIngrediente[]) => {
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

                const seAgregan = new Set<number>(
                    [...selectedOptions].filter((option) => !ingredientes2.some((ingrediente) => ingrediente.id_Ingrediente === option))
                );
                
                const seQuitan = new Set<number>(
                ingredientes2
                    .filter((ingrediente) => !selectedOptions.has(ingrediente.id_Ingrediente))
                    .map((ingrediente) => ingrediente.id_Ingrediente)
                );

                seAgregan.forEach(async (elemento) => {
                    const aux2: DtProducto_Ingrediente = {
                        id_Producto: parseInt(id_Producto),
                        id_Ingrediente: elemento
                    };
                    await agregarIngredienteProducto(aux2);
                });
                seQuitan.forEach(async (elemento) => {
                    const aux3: DtProducto_Ingrediente = {
                        id_Producto: parseInt(id_Producto),
                        id_Ingrediente: elemento
                    };
                    await quitarProductos_Ingredientes(aux3);
                });            
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

    const verProductos = (id_Producto: number, nombre: string, descripcion: string, precio: number, tipo: number) => {
        setId(id_Producto.toString());
        setNombre(nombre);
        setDescripcion(descripcion);
        setPrecio(precio.toString());
        setTipo(tipo.toString());
        setIngredientes2([]);
        setSelectedOptions(new Set());
    
        listarIngredientesProductos(id_Producto)
          .then((res) => {
            setIngredientes2(res);
            const newSelectedOptions = new Set<number>();
            res.forEach((ing: DtIngrediente) => {
              newSelectedOptions.add(ing.id_Ingrediente);
            });
            setSelectedOptions(newSelectedOptions);
          })
          .catch((error) => {
            console.error("Error al obtener ingredientes: " + error);
          });
      
        setTitle('Información del Producto');
        controlModal('modalProductos2', 'abrir');
    };      

    const selectCheck = (id: number) => {
        const updatedOptions = new Set(selectedOptions);
        if (updatedOptions.has(id)) {
          updatedOptions.delete(id);
        } else {
          updatedOptions.add(id);
        }
        setSelectedOptions(updatedOptions);
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
                                  <TableCell>Accion</TableCell>
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
                            <input type='text' id='nombre' className='form-control color-Style' value={nombre}
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Descripcion<i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='descripcion' className='form-control color-Style' value={descripcion}
                            onChange={(e)=> setDescripcion(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Precio<i className='fa-solid fa-comment'></i></span>
                            <input type='number' min='0' id='precio' className='form-control color-Style' value={precio}
                            onChange={(e)=> setPrecio(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Tipo<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                id='tipo'
                                className='form-control color-Style'
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
                            <FormControl style={{ color: 'black' }}>
                                <Select multiple value={Array.from(selectedOptions)} className='my-form-control'>
                                {ingredientes.map((ingrediente) => (
                                    <MenuItem key={ingrediente.id_Ingrediente} value={ingrediente.id_Ingrediente} onClick={() => selectCheck(ingrediente.id_Ingrediente)}>
                                    <Checkbox checked={selectedOptions.has(ingrediente.id_Ingrediente)}/>
                                    {ingrediente.nombre}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <Button onClick={() => modificarProducto(nombre, descripcion, precio, tipo, ingredientes2)} className='btn btn-success'>
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
                            <input type='text' id='nombre' className='form-control color-Style' value={nombre}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Descripcion<i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='descripcion' className='form-control color-Style' value={descripcion}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Precio<i className='fa-solid fa-comment'></i></span>
                            <input type='text' id='precio' className='form-control color-Style' value={precio}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Tipo<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                id='tipo'
                                className='form-control color-Style'
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
                            <FormControl style={{ color: 'black' }}>
                                <Select multiple value={Array.from(selectedOptions)} disabled={true} className='my-form-control'>
                                {ingredientes.map((ingrediente) => (
                                    <MenuItem key={ingrediente.id_Ingrediente} value={ingrediente.id_Ingrediente} onClick={() => selectCheck(ingrediente.id_Ingrediente)}>
                                    <Checkbox checked={selectedOptions.has(ingrediente.id_Ingrediente)}/>
                                    {ingrediente.nombre}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
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
                            <input type='text' id='nombre' className='form-control color-Style' value={nombre}
                            onChange={(e)=> setNombre(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Descripcion<i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='descripcion' className='form-control color-Style' value={descripcion}
                            onChange={(e)=> setDescripcion(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Precio<i className='fa-solid fa-comment'></i></span>
                            <input type='number' min='0' id='precio' className='form-control color-Style' value={precio}
                            onChange={(e)=> setPrecio(e.target.value)}></input>
                        </div>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'>Tipo<i className='fa-solid fa-dollar-sign'></i></span>
                            <select
                                id='tipo'
                                className='form-control color-Style'
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
                            <FormControl style={{ color: 'black' }}>
                                <Select multiple value={Array.from(selectedOptions)} className='my-form-control'>
                                {ingredientes.map((ingrediente) => (
                                    <MenuItem key={ingrediente.id_Ingrediente} value={ingrediente.id_Ingrediente} onClick={() => selectCheck(ingrediente.id_Ingrediente)}>
                                    <Checkbox checked={selectedOptions.has(ingrediente.id_Ingrediente)}/>
                                    {ingrediente.nombre}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <Button onClick={() => crearProducto(nombre, descripcion, precio, tipo)} className='btn btn-success'>
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

export default Producto


