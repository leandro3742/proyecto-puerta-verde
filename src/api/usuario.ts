import { BACKEND_URL } from "../assets/constant";
import { DtUsuario } from "../dataTypes/DtUsuario";
import { DtUsuarioRol } from "../dataTypes/DtUsuarioRol";

export const agregarUsuario = async (Usuario: DtUsuario) => {
  try {
    const response = await fetch(BACKEND_URL + 'Register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(Usuario)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const eliminarUsuario = async (username: string) => {
  try {
    const response = await fetch(BACKEND_URL + `BajaUsuario/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: username
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export const listarUsuarios = async () => {
  try {
    const response = await fetch(BACKEND_URL + 'listarUsuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const listarRoles = async (username: string) => {
  try {
    const response = await fetch(BACKEND_URL + 'ObtenerRoles?username=' + username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export const agregarRolUsuario = async (UsuarioRol: DtUsuarioRol) => {
  console.log("Este es el rol: " + UsuarioRol.roleName + UsuarioRol.userName);
  try {
    const response = await fetch(BACKEND_URL + 'AddRole', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(UsuarioRol)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const actualizarUsuario = async (Usuario: DtUsuario) => {
  try {
    const response = await fetch(BACKEND_URL + 'modificarUsuario', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(Usuario)
    })
    const data = await response.json()
    return data;
  } catch (error) {
    throw error
  }
}

export const eliminarRol = async (rol: DtUsuarioRol) => {
  try {
    const response = await fetch(BACKEND_URL + 'BajaRole', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(rol)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}