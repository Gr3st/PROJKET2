import React, { useEffect, useState } from 'react';
import { useAdminService } from '../services/useAdminService';
import { useGetPrice } from '../services/useGetPrice';
import "../style/Adm.css";
import axios from 'axios';

const PanelAdmin = () => {
  const { cena, setCena, czas, setCzas, handleSetPrice, downloadCSV } = useAdminService();
  const { dataPrice, handleGetPrice } = useGetPrice();
  const [inputTime, setInputTime] = useState(czas);
  const [updStatus, setUpdStatus] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    handleGetPrice();
    setInputTime(czas);
  }, [czas, handleGetPrice]);

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
      await axios.put(`https://projket2.onrender.com/price/update`, { cena, nowaCena });
      handleGetPrice();
    } catch (error) {
      console.error('Error updating expiration status:', error);
    }
  };

  const renderUpdateSection = (res) => {
    if (updStatus && selectedPrice === res.cena) {
      return (
        <div className='update-column'>
          <div className='price-update-form'>
            <input
              type="text"
              value={cena}
              onChange={(e) => setCena(e.target.value)}
            />
            <button onClick={() => {
              updatePrice(selectedPrice, cena);
              setUpdStatus(false);
              setSelectedPrice(null);
            }}>
              Confirm
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className='update-column'>
          <button className='update-button' onClick={() => {
            setUpdStatus(true);
            setSelectedPrice(res.cena);
          }}>
            Update
          </button>
        </div>
      );
    }
  };

  return (
    <div className='admin-panel-container'>
      <h2>Panel Administracyjny</h2>
      <div className='admin-panel-header'>
        <h3>Ustaw Limity Czasowe</h3>
      </div>
      <div className='admin-panel-body'>
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
      <div className="admin-panel-buttons">
        <button onClick={handleSetPrice}>DODAJ</button>
        <button onClick={downloadCSV}>Pobierz CSV</button>
      </div>
      <div className='price-table-container'>
        <div className='price-table-header'>
          <div className='price-column'>Cena</div>
          <div className='time-column'>Czas</div>
          <div className='update-column'>Update</div>
          <div className='delete-column'>Delete</div>
        </div>
        {dataPrice.map((res) => (
          <div className='price-table-row' key={res.cena}>
            <div className='price-table-data'>
              <div className='price-column'>{res.cena}</div>
              <div className='time-column'>{res.timeRange}</div>
              {renderUpdateSection(res)}
              <div className="delete-button">Delete</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelAdmin;