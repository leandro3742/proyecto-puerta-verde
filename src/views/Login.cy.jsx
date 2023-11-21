import Login from './Login'
import { SnackbarProvider } from 'notistack';

describe('Login Component Tests', () => {
  const mountLogin = () => {
    cy.mount(
      <SnackbarProvider maxSnack={3}>
        <Login />
      </SnackbarProvider>
    );
  };

  it('should display the login form', () => {
    mountLogin();
    cy.get('.login-box').should('be.visible');
    cy.get('input[name="usuario"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Iniciar sesion');
  });

  it('should allow a user to type in the username and password fields', () => {
    mountLogin();
    cy.get('input[name="usuario"]').type('testuser@gmail.com').should('have.value', 'testuser@gmail.com');
    cy.get('input[name="password"]').type('password123!A').should('have.value', 'password123!A');
    cy.contains('Usuario y/o contraseña incorrectos').should('be.visible');

  });

  it('should not submit the form with empty fields', () => {
    mountLogin();
    cy.get('button[type="submit"]').click();
    cy.contains('Los campos no deben estar vacíos').should('be.visible');
  });

  it('should show a success message on successful login', () => {
    mountLogin();
    cy.get('input[name="usuario"]').type('admin@example.com').should('have.value', 'admin@example.com');
    cy.get('input[name="password"]').type('Grupo2023*!').should('have.value', 'Grupo2023*!');
    cy.get('button[type="submit"]').click();

    // Ajusta el selector para el mensaje de éxito según tu implementación
    cy.contains('Bienvenido ').should('be.visible');
  });

});