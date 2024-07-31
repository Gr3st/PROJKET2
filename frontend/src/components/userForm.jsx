import '../style/userForm.css';
import { useFormService } from '../services/useFormService';
import { useGetPrice } from '../services/useGetPrice';
import { useAdminService } from '../services/useAdminService';
import { useEffect } from 'react';
import UserTable from './userTable';

function UserForm() {
  const { imie, setImie, nazwisko, setNazwisko, email, setEmail, id, setId, cena, setCena, countdown, setCountdown, handleSendData, handleStopCountdown } = useFormService();
  const { dataPrice, handleGetPrice } = useGetPrice();
  const { cena: adminCena, czas } = useAdminService();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendData();
    }
  };

  useEffect(() => {
    handleGetPrice();
  }, [czas, adminCena, handleGetPrice]);

  const handleTimeRangeChange = (e) => {
    const selectedTimeRange = e.target.value;
    setCountdown(selectedTimeRange);
    const selectedPrice = dataPrice.find(res => res.timeRange === selectedTimeRange)?.cena || '';
    setCena(selectedPrice);
  };

  const handleIdChange = (e) => {
    const newId = e.target.value;
    setId(newId);
    if (newId) {
      const confirmStop = window.confirm("Czy jesteś pewien, że chcesz zatrzymać czas dla tego użytkownika?");
      if (confirmStop) {
        handleStopCountdown(newId);
      }
    }
  };

  const handleAddChild = () => {
    const countdownParts = countdown.split(':');
    const countdownSeconds = parseInt(countdownParts[0], 10) * 3600 + parseInt(countdownParts[1], 10) * 60;
    const newExpirationTime = new Date(Date.now() + countdownSeconds * 1000);

    handleSendData({ imie, nazwisko, email, id, countdown: countdownSeconds, exitDate: newExpirationTime });
  };

  return (
    <div className="user-form">
      <input type="text" placeholder="Imię" value={imie} onChange={(e) => setImie(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder="Nazwisko" value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder="ID" value={id} onChange={handleIdChange} onKeyDown={handleKeyPress} />

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
        {cena}{cena && " zł"}
      </div>

      <button onClick={handleAddChild}>Dodaj Dziecko</button>

      <UserTable />
    </div>
  );
}

export default UserForm;
