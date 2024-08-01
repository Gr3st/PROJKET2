import '../style/userForm.css';
import axios from 'axios';
import { useGetData } from '../services/useGetData';
import { useEffect, useState, useCallback } from 'react';

function UserTable() {
  const { data, handleGetData } = useGetData();
  const [currentTime, setCurrentTime] = useState(Date.now());

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`https://projket2.onrender.com/user/${userId}`);
      console.log('User deleted:', response.data);
      handleGetData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    handleGetData();
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [handleGetData]);

  const updateExpirationStatus = useCallback(async (userId, exitDate, elapsedTime, additionalCost) => {
    try {
      await axios.put(`https://projket2.onrender.com/user/${userId}/expiration`, { exitDate, elapsedTime, additionalCost });
      handleGetData();
    } catch (error) {
      console.error('Error updating expiration status:', error);
    }
  }, [handleGetData]);

  const calculateOverdueTime = (exitDate) => {
    const overdueTime = (Date.now() - new Date(exitDate).getTime()) / 1000;
    return overdueTime > 0 ? overdueTime : 0;
  };

  const calculateAdditionalCost = (overdueTime) => {
    const overtimeMinutes = Math.ceil(overdueTime / 60);
    return Math.floor(overtimeMinutes / 1); // Adjust this as needed for specific cost calculations
  };

  const handleStop = useCallback((userId, exitDate) => {
    const overdueTime = calculateOverdueTime(exitDate);
    const additionalCost = calculateAdditionalCost(overdueTime);
    updateExpirationStatus(userId, new Date().toISOString(), overdueTime, additionalCost);
  }, [updateExpirationStatus]);

  useEffect(() => {
    data.forEach(res => {
      if (!res.exitDate && res.remainingTime <= 0) {
        handleStop(res.id, res.exitDate);
      }
    });
  }, [data, currentTime, handleStop]);

  const calculateTimeDifference = (entryDate, exitDate) => {
    const entryTime = new Date(entryDate).getTime();
    const exitTime = new Date(exitDate).getTime();
    const timeDifference = (exitTime - entryTime) / 1000;
    return timeDifference;
  };

  return (
    <div className="user-table">
      <div className="table-header">
        <div className="column-header">IMIE</div>
        <div className="column-header">NAZWISKO</div>
        <div className="column-header">EMAIL</div>
        <div className="column-header">ID</div>
        <div className="column-header">CENA</div>
        <div className="column-header">CZAS</div>
        <div className="column-header">Akcje</div>
      </div>
      {data.map(res => (
        <div className="table-row" key={res.id}>
          <div className="table-cell">{res.imie}</div>
          <div className="table-cell">{res.nazwisko}</div>
          <div className="table-cell">{res.email}</div>
          <div className="table-cell">{res.id}</div>
      
          {/* <div className="table-cell">{calculateOverdueTime(res.exitDate)>0?res.cena + calculateAdditionalCost(calculateOverdueTime(res.exitDate)):res.cena}</div> */}
          <div className="table-cell">{res.countdown === (calculateTimeDifference(res.entryDate, res.exitDate)?res.cena : res.cena + calculateAdditionalCost(calculateOverdueTime(res.exitDate))}</div>
          
          <div className="table-cell">
            {!res.exitDate ? (
              <div>
                {Math.floor(res.remainingTime / 3600)}h {Math.floor((res.remainingTime % 3600) / 60)}m {Math.floor(res.remainingTime % 60)}s 
                <button onClick={() => handleStop(res.id, res.exitDate)}>STOP</button>
              </div>
            ) : (
              res.remainingTime <= 0 ? (
                <>
                  Przekroczono czas o {Math.floor(calculateOverdueTime(res.exitDate) / 3600)}h {Math.floor((calculateOverdueTime(res.exitDate) % 3600) / 60)}m {Math.floor(calculateOverdueTime(res.exitDate) % 60)}s
                </>
              ) : (
                <>{Math.floor(calculateTimeDifference(res.entryDate, res.exitDate) / 3600)}h {Math.floor((calculateTimeDifference(res.entryDate, res.exitDate) % 3600) / 60)}m {Math.floor(calculateTimeDifference(res.entryDate, res.exitDate) % 60)}s</>
              )
            )}
          </div>
          <div className="table-cell">
            <button onClick={() => deleteUser(res.id)}>Usuń</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserTable;