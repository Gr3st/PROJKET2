import '../style/userForm.css';
import { formService } from '../services/formService';
import { getData } from '../services/getData';
import { useEffect, useState } from 'react';

function userForm() {
  const { imie, setImie, nazwisko, setNazwisko, email, setEmail, id, setId, cena, setCena, countdown, setCountdown, handleSendData } = formService();
  const { data, handleGetData } = getData();
  const [currentTime, setCurrentTime] = useState(Date.now());

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
    const expirationTime = Date.now() + countdownSeconds * 1000;

    handleSendData({ imie, nazwisko, email, id, expirationTime });
  };

  return (
    <div className="user-form">
      <input type="text" placeholder='Imie' value={imie} onChange={(e) => setImie(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder='Nazwisko' value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder='ID' value={id} onChange={(e) => setId(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder='CENA' value={cena} onChange={(e) => setCena(e.target.value)} onKeyDown={handleKeyPress} />
      <select>

        <option></option>
        
      </select>
      <input type="text" placeholder='Countdown (hours:minutes)' value={countdown} onChange={(e) => setCountdown(e.target.value)} onKeyDown={handleKeyPress} />
      <button onClick={handleAddChild}>Dodaj Dziecko</button>
      <div className="user-tabela">
        <div className='user-row'>
          <div className='imie'>IMIE</div>
          <div className='nazwisko'>NAZWISKO</div>
          <div className='email'>EMAIL</div>
          <div className='id'>ID</div>
          <div className='cena'>CENA</div>
          <div className='czas'>CZAS</div>
        </div>
        {data.map(res => (
            <div className='user-row' key={res.id}>
              <div className='imie'>{res.imie}</div>
              <div className='nazwisko'>{res.nazwisko}</div>
              <div className='email'>{res.email}</div>
              <div className='id'>{res.id}</div>
              <div className='cena'>{res.cena}</div>
              <div className='czas'>
                {calculateTime(res.remainingTime, res.expirationTime)}
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default userForm;
