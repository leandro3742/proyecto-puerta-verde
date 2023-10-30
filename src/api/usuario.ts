import { BACKEND_URL } from "../assets/constant";
import { DtUsuario } from "../dataTypes/DtUsuario";

export const agregarUsuario = async (Usuario: DtUsuario) => {
    try {
      const response = await fetch(BACKEND_URL + 'Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Usuario)
      })
      const data = await response.json()
      return data;
    } catch (error) {
      throw error
    }
  }
  
  /*export const agregarRol = async (Usuario: DtUsuario) => {
    try {
      const response = await fetch(BACKEND_URL + 'api/actualizarCliente', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Usuario)
      })
      const data = await response.json()
      return data;
    } catch (error) {
      throw error
    }
  }*/
  
  export const eliminarUsuario = async (username: string) => {
    try {
      const response = await fetch(BACKEND_URL + `BajaUsuario/${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  export const listarUsuarios = async () => {
    try {
      const response = await fetch(BACKEND_URL + 'Usuarios');
      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  }

  export const listarRoles = async (username: string) => {
    try {
      const response = await fetch(BACKEND_URL + 'ObtenerRoles'+username);
      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  }

  /*export const agregarRol = async (username: string, rol: string) => {
    try {
      const response = await fetch(BACKEND_URL + 'AddRol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify()
      })
      const data = await response.json()
      return data;
    } catch (error) {
      throw error
    }
  }*/