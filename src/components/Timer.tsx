import { useState, useEffect } from 'react';

interface TimerProps {
  startDate: string;
  pedidoId: number;
  changeBg: (id: number) => void;
}

const Timer = (props: TimerProps) => {
  const { startDate, pedidoId, changeBg } = props;

  // Estado para almacenar los minutos y horas transcurridos
  const [timePassed, setTimePassed] = useState<string>('00:00');

  useEffect(() => {
    // Función para calcular los minutos y horas transcurridos desde la fecha de inicio
    const calculateTimePassed = () => {
      const now = new Date();
      const start = new Date(startDate);
      const difference = now.getTime() - start.getTime();
      const minutesPassed = Math.max(0, Math.floor(difference / 60000));
      const hours = Math.floor(minutesPassed / 60);
      const minutes = minutesPassed % 60;
      //Si pasa mas de 45 minutos sacar alerta
      if (minutesPassed > 45 || hours > 0) {
        changeBg(pedidoId)
      }
      // Formatea el tiempo a hh:mm
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // Establece el tiempo inicial transcurrido
    setTimePassed(calculateTimePassed());

    // Establece un intervalo para actualizar el contador cada segundo
    const intervalId = setInterval(() => {
      setTimePassed(calculateTimePassed());
    }, 1000); // Actualiza cada segundo

    // Limpieza del intervalo en el desmontaje del componente
    return () => clearInterval(intervalId);
  }, [startDate]); // Dependencia solo en startDate para que el efecto se ejecute solo cuando cambie

  // Renderiza el tiempo transcurrido en formato hh:mm
  return (
    <div>
      <h4>Tiempo: {timePassed}</h4>
    </div>
  );
};


export default Timer;
