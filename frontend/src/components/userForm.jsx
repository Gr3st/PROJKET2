import '../style/userForm.css';
import { formService } from '../services/formService';
import { getData } from '../services/getData';
import { useEffect, useState } from 'react';

function userForm() {
  const { imie, setImie, nazwisko, setNazwisko, email, setEmail, id, setId, countdown, setCountdown, handleSendData } = formService();
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

  return (
    <div className="user-form">
      <input type="text" placeholder='Imie' value={imie} onChange={(e) => setImie(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder='Nazwisko' value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder='ID' value={id} onChange={(e) => setId(e.target.value)} onKeyDown={handleKeyPress} />
      <input type="text" placeholder='Countdown (hours:minutes)' value={countdown} onChange={(e) => setCountdown(e.target.value)} onKeyDown={handleKeyPress} />
      <button onClick={handleSendData}>Dodaj Dziecko</button>
      <div className="user-tabela">
        <div className='user-row'>
          <div className='imie'>IMIE</div>
          <div className='nazwisko'>NAZWISKO</div>
          <div className='email'>EMAIL</div>
          <div className='id'>ID</div>
          <div className='czas'>CZAS</div>
        </div>
        {data.map(res => (
            <div className='user-row' key={res.id}>
              <div className='imie'>{res.imie}</div>
              <div className='nazwisko'>{res.nazwisko}</div>
              <div className='email'>{res.email}</div>
              <div className='id'>{res.id}</div>
              <div className='czas'>
                {res.remainingTime > 0 ?
                  `${Math.floor(res.remainingTime / 3600)}h ${Math.floor((res.remainingTime % 3600) / 60)}m ${Math.floor(res.remainingTime % 60)}s` :
                  'Time Expired'
                }
              </div>
            </div>
          
        ))}
      </div>
    </div>
  );
}

export default userForm;
