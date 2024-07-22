import '../style/userForm.css';
import axios from 'axios';
import { formService } from '../services/formService';
import { adminService } from '../services/adminService';
import { getData } from '../services/getData';
import { getPrice } from '../services/getPrice';
import { useEffect, useState } from 'react';

function UserForm() {
  const { imie, setImie, nazwisko, setNazwisko, email, setEmail, id, setId, cena, setCena, countdown, setCountdown, handleSendData } = formService();
  const { cena: adminCena, czas } = adminService();
  const { data, handleGetData } = getData();
  const { dataPrice, handleGetPrice } = getPrice();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Funkcja do usuwania użytkownika
  const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`https://crispy-xylophone-44q6rq6wwxjcjrjg-4000.app.github.dev/user/${userId}`); // Użyj lokalnego serwera
        console.log('User deleted:', response.data);
        handleGetData(); // Odśwież dane po usunięciu użytkownika
    } catch (error) {
        console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    handleGetPrice();
  }, [czas, adminCena]);

  useEffect(() => {
    handleGetData();
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendData();
    }
  };

  const calculateTime = (remainingTime, expirationTime) => {
    if (remainingTime > 0) {
      return `${Math.floor(remainingTime / 3600)}h ${Math.floor((remainingTime % 3600) / 60)}m ${Math.floor(remainingTime % 60)}s`;
    } else {
      const elapsed = (currentTime - expirationTime) / 1000;
      return `Elapsed: ${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m ${Math.floor(elapsed % 60)}s`;
    }
  };

  const handleAddChild = () => {
    const countdownParts = countdown.split(':');
    const countdownSeconds = parseInt(countdownParts[0], 10) * 3600 + parseInt(countdownParts[1], 10) * 60;
    const expirationTime = new Date(Date.now() + countdownSeconds * 1000);

    handleSendData({ imie, nazwisko, email, id, countdown: countdownSeconds, exitDate: expirationTime });
  };

  const handleTimeRangeChange = (e) => {
    const selectedTimeRange = e.target.value;
    setCountdown(selectedTimeRange);
    const selectedPrice = dataPrice.find(res => res.timeRange === selectedTimeRange)?.cena || '';
    setCena(selectedPrice);
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

      <div className="user-tabela">
        <div className="user-row-title">
          <div className="imie">IMIE</div>
          <div className="nazwisko">NAZWISKO</div>
          <div className="email">EMAIL</div>
          <div className="id">ID</div>
          <div className="cena">CENA</div>
          <div className="czas">CZAS</div>
          <div className="akcje">Akcje</div>
        </div>
        {data.map(res => (
          <div className="user-row" key={res.id}>
            <div className="imie">{res.imie}</div>
            <div className="nazwisko">{res.nazwisko}</div>
            <div className="email">{res.email}</div>
            <div className="id">{res.id}</div>
            <div className="cena">{res.cena}</div>
            <div className="czas">{calculateTime(res.remainingTime, res.expirationTime)}</div>
            <div className="akcje">
              <button onClick={() => deleteUser(res.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserForm;
