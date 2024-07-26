import React, { useEffect, useState } from 'react';
import { useAdminService } from '../services/useAdminService';
import { useGetPrice } from '../services/useGetPrice';
import "../style/adminStyle.css";
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
    <div className='admin-panel'>
      <div className='admin-form'>
        <h2 className='admin-heading'>Add Price</h2>
        <label className='admin-label'>
          Time:
          <input className='admin-input' type="text" value={inputTime} onChange={handleTimeChange} />
        </label>
        <label className='admin-label'>
          Price:
          <input className='admin-input' type="text" value={cena} onChange={(e) => setCena(e.target.value)} />
        </label>
        <button className='admin-button' onClick={handleSetPrice}>Add</button>
      </div>
      <div className='admin-table'>
        <h2 className='admin-heading'>Prices</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Price</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {dataPrice.map((res, index) => (
              <tr key={index}>
                <td>{res.czas}</td>
                <td>{res.cena}</td>
                <td>{renderUpdateSection(res)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className='download-button' onClick={downloadCSV}>Download CSV</button>
    </div>
  );
};

export default PanelAdmin;
