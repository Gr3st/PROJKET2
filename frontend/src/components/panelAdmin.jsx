import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';

const PanelAdmin = () => {
  const { cena, setCena, czas, setCzas, handleSetPrice, downloadCSV } = adminService();
  const [inputTime, setInputTime] = useState(czas);

  useEffect(() => {
    setInputTime(czas);
  }, [czas]);

  const handleTimeChange = (e) => {
    const value = e.target.value;
    const [hours, minutes] = parseTime(value);

    if (hours >= 0 && minutes >= 0 && minutes < 60) {
      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
      setCzas(formattedTime);
      setInputTime(formattedTime);
    } else {
      setInputTime(value);
    }
  };

  const parseTime = (time) => {
    const timeParts = time.split(':');
    let hours = 0;
    let minutes = 0;

    if (timeParts.length === 1) {
      minutes = parseInt(timeParts[0], 10);
    } else if (timeParts.length === 2) {
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
    }

    return [hours, minutes];
  };

  return (
    <div>
      <h2>Panel Administracyjny</h2>
      <div>
        <h3>Ustaw Limity Czasowe</h3>
      </div>
      <div>
        <h3>Ustaw Czas</h3>
        <input
          type="text"
          value={inputTime}
          onChange={handleTimeChange}
          placeholder="HH:MM"
        />
        <h3>Ustaw Ceny</h3>
        <input
          type="text"
          value={cena}
          onChange={(e) => setCena(e.target.value)}
        />
        <button onClick={handleSetPrice}>DODAJ</button>
        <button onClick={downloadCSV}>Pobierz CSV</button>
      </div>
    </div>
  );
};

export default PanelAdmin;
