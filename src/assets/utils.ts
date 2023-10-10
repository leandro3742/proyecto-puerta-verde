export function getHora(): string {
  const date = new Date();
  const hora = date.getHours();
  const min = date.getMinutes();
  const seg = date.getSeconds();
  return `${hora}:${min}:${seg}`;
}

export function getFecha(): string {
  const date = new Date();
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
}