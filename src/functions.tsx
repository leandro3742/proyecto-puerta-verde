import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function show_alerta(mensaje: any,icono: any,foco=''){
    onfocus(foco);
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title:mensaje,
        icon:icono
    });
}

function onfocus(foco: any){
    if(foco !== ''){
        const elemento = document.getElementById(foco);
        if (elemento) {
        elemento.focus();
        } else {
        console.log('Elemento no encontrado');
        }
    }
}
