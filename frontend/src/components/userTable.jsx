import '../style/userForm.css';
import axios from 'axios';
import { formService } from '../services/formService';
import { adminService } from '../services/adminService';
import { getData } from '../services/getData';
import { getPrice } from '../services/getPrice';
import { useEffect, useState } from 'react';

function UserTable() {
  const { imie, setImie, nazwisko, setNazwisko, email, setEmail, id, setId, cena, setCena, countdown, setCountdown, handleSendData } = formService();
  // const { cena: adminCena, czas } = adminService();
  const { data, handleGetData } = getData();
  const { dataPrice, handleGetPrice } = getPrice();
  const [currentTime, setCurrentTime] = useState(Date.now());

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`https://crispy-xylophone-44q6rq6wwxjcjrjg-4000.app.github.dev/user/${userId}`);
      console.log('User deleted:', response.data);
      handleGetData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // useEffect(() => {
  //   handleGetPrice();
  // }, [czas, adminCena]);

  useEffect(() => {
    handleGetData();
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [handleGetData]);

  const updateExpirationStatus = async (userId, exitDate, elapsedTime) => {
    try {
      await axios.put(`https://crispy-xylophone-44q6rq6wwxjcjrjg-4000.app.github.dev/user/${userId}/expiration`, { exitDate, elapsedTime });
      handleGetData();
    } catch (error) {
      console.error('Error updating expiration status:', error);
    }
  };

  const calculateOverdueTime = (exitDate) => {
    const currentTime = Date.now();
    const overdueTime = (currentTime - new Date(exitDate).getTime()) / 1000; // Ensure the division by 1000 for seconds
    console.log(`Overdue time for exitDate ${exitDate}: ${overdueTime}`);
    return overdueTime > 0 ? overdueTime : 0;
  };

  const handleStop = (userId, exitDate) => {
    const overdueTime = calculateOverdueTime(exitDate);
    updateExpirationStatus(userId, new Date().toISOString(), overdueTime);
  };

  useEffect(() => {
    data.forEach(res => {
      if (!res.exitDate && res.remainingTime <= 0) {
        handleStop(res.id, res.exitDate);
      }
    });
  }, [data, currentTime]);

  const calculateTimeDifference = (entryDate, exitDate) => {
    const entryTime = new Date(entryDate).getTime();
    const exitTime = new Date(exitDate).getTime();
    const timeDifference = (exitTime - entryTime) / 1000; // Convert to seconds
    return timeDifference;
  };

  return (
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
          <div className="czas">
            {!res.exitDate ? (
              <div>
                {`${Math.floor(res.remainingTime / 3600)}h ${Math.floor((res.remainingTime % 3600) / 60)}m ${Math.floor(res.remainingTime % 60)}s`} 
                <button onClick={() => handleStop(res.id, res.exitDate)}>STOP</button>
              </div>
            ) : (
              res.remainingTime <= 0 ? (
                <>
                  {`Przekroczono czas o ${Math.floor(calculateOverdueTime(res.exitDate) / 3600)}h ${Math.floor((calculateOverdueTime(res.exitDate) % 3600) / 60)}m ${Math.floor(calculateOverdueTime(res.exitDate) % 60)}s`}
                </>
              ) : (
                <>{`${Math.floor(calculateTimeDifference(res.entryDate,res.exitDate)  / 3600)}h ${Math.floor((calculateTimeDifference(res.entryDate,res.exitDate)  % 3600) / 60)}m ${Math.floor(calculateTimeDifference(res.entryDate,res.exitDate)  % 60)}s`}</>
              )
            )}
          </div>
          <div className="akcje">
            <button onClick={() => deleteUser(res.id)}>Usuń</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserTable;
