import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { getPrice } from '../services/getPrice';
import "../style/adminStyle.css";
import axios from 'axios';  // Make sure axios is imported

const PanelAdmin = () => {
  const { cena, setCena, czas, setCzas, handleSetPrice, downloadCSV } = adminService();
  const { dataPrice, handleGetPrice } = getPrice();
  const [inputTime, setInputTime] = useState(czas);
  const [updStatus, setUpdStatus] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    handleGetPrice();
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

  const updatePrice = async (cena, nowaCena) => {
    try {
      await axios.put(`https://crispy-xylophone-44q6rq6wwxjcjrjg-4000.app.github.dev/price/update`, { cena, nowaCena});
      handleGetPrice(); // Refresh the prices after update
    } catch (error) {
      console.error('Error updating expiration status:', error);
    }
  };

  return (
    <div className='Panel-Container'>
      <h2>Panel Administracyjny</h2>
      <div>
        <h3>Ustaw Limity Czasowe</h3>
      </div>
      <div className='panel-inside'>
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
          onChange={(e) => setCena(e.target.value)}
        />
      </div>
      <div className="btn-admin">
        <button onClick={handleSetPrice}>DODAJ</button>
        <button onClick={downloadCSV}>Pobierz CSV</button>
      </div>
      <div className='tabela-container'>
        <div className='Tabela-ceny'>
          <div className='cena'>Cena</div>
          <div className='czas'>Czas</div>
          <div className='update'>Update</div>
        </div>
        {dataPrice.map((res) => (
          <div className='Tabela-ceny-under'>
            <div className="Tabela-up" key={res.cena}>
              <div className='cena'>{res.cena}</div>
              <div className='czas'>{res.timeRange}</div>
              <button className='update' onClick={() => {
                setUpdStatus(true);
                setSelectedPrice(res.cena);
              }}>
                Update
              </button>
            </div>
            {updStatus && selectedPrice === res.cena && (
              <div className='Tabela-down'>
                <input 
                  type="text" 
                  value={cena} 
                  onChange={(e) => setCena(e.target.value)} 
                />
                <button onClick={() => {
                  updatePrice(selectedPrice, cena);
                  setUpdStatus(false);
                }}>
                  Confirm
                </button>
              </div>
           
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelAdmin;
