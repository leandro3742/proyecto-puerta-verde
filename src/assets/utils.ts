export function getHora(date: string): string {
  // const date = new Date();
  //Parse date string to Date object
  console.log(date);
  const dateObj = new Date(date);
  const hora = dateObj.getHours();
  const min = dateObj.getMinutes();
  const seg = dateObj.getSeconds();
  return `${hora}:${min}:${seg}`;
}

export function getFecha(): string {
  const date = new Date();
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

export function verifyToken(): boolean {
  if (localStorage.getItem('tokenExpiration')) {
    const tokenExpiration: string | null = localStorage.getItem('tokenExpiration');
    const tokenExpirationDate: Date | null = tokenExpiration ? new Date(tokenExpiration) : null;
    if (!localStorage.getItem('token') || (tokenExpirationDate && tokenExpirationDate <= new Date())) {
      return false;
    }
    return true
  }
  return false
}