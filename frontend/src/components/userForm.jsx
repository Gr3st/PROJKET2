import '../style/userForm.css';
import axios from 'axios';
import { formService } from '../services/formService';
import { adminService } from '../services/adminService';
import { getData } from '../services/getData';
import { getPrice } from '../services/getPrice';
import { useEffect, useState } from 'react';
import UserTable from './userTable';

function UserForm() {
  const { imie, setImie, nazwisko, setNazwisko, email, setEmail, id, setId, cena, setCena, countdown, setCountdown, handleSendData } = formService();
  const { dataPrice, handleGetPrice } = getPrice();
  const { cena: adminCena, czas } = adminService();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendData();
    }
  };
  
  useEffect(() => {
    handleGetPrice();
  }, [czas, adminCena]);

  const handleTimeRangeChange = (e) => {
    const selectedTimeRange = e.target.value;
    setCountdown(selectedTimeRange);
    const selectedPrice = dataPrice.find(res => res.timeRange === selectedTimeRange)?.cena || '';
    setCena(selectedPrice);
  };


  const handleAddChild = () => {
    const countdownParts = countdown.split(':');
    const countdownSeconds = parseInt(countdownParts[0], 10) * 3600 + parseInt(countdownParts[1], 10) * 60;
    const newExpirationTime = new Date(Date.now() + countdownSeconds * 1000);

    handleSendData({ imie, nazwisko, email, id, countdown: countdownSeconds, exitDate: newExpirationTime });
  };


  return (
    <div className="user-form">
      <input type="text" placeholder="Imie" value={imie} onChange={(e) => setImie(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder="Nazwisko" value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} onKeyDown={handleKeyPress} />

      <div>
        Czas: 
        <select onChange={handleTimeRangeChange}>
          <option value="-">-</option>
          {dataPrice.map(res => (
            <option key={res.timeRange} value={res.timeRange}>{res.timeRange}</option>
          ))}
        </select>
      </div>

      <div>
        Cena: 
        {cena}{cena && "zł"}
      </div>

      <button onClick={handleAddChild}>Dodaj Dziecko</button>

      <UserTable />
    
    </div>
  );
}

export default UserForm;
