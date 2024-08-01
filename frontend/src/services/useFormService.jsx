// src/services/useFormService.js

import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

export function useFormService() {
  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [cena, setCena] = useState('');
  const [countdown, setCountdown] = useState('');
  const [postData, setPostData] = useState({});
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    setPostData({ imie, nazwisko, email, id, countdown, cena });
  }, [imie, nazwisko, email, id, countdown, cena]);

  const handleSendData = async () => {
    try {
      console.log('Sending data:', postData);
      const res = await axios.post('https://projket2.onrender.com/user', postData);
      console.log('Response:', res);
      setImie('');
      setNazwisko('');
      setEmail('');
      setId('');
      setCountdown('');
      setCena('');
      setIsStopped(false);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const calculateOverdueTime = (exitDate) => {
    const overdueTime = (Date.now() - new Date(exitDate).getTime()) / 1000;
    return overdueTime > 0 ? overdueTime : 0;
  };

  const calculateAdditionalCost = (overdueTime) => {
    const overtimeMinutes = Math.ceil(overdueTime / 60);
    return Math.floor(overtimeMinutes / 1);
  };

  const updateExpirationStatus = useCallback(async (userId, exitDate, elapsedTime, additionalCost) => {
    try {
      await axios.put(`https://projket2.onrender.com/user/${userId}/expiration`, { exitDate, elapsedTime, additionalCost });
    } catch (error) {
      console.error('Error updating expiration status:', error);
    }
  }, []);

  const handleStopCountdown = useCallback((userId, exitDate) => {
    if (!isStopped) {
      const overdueTime = calculateOverdueTime(exitDate);
      const additionalCost = calculateAdditionalCost(overdueTime);
      updateExpirationStatus(userId, new Date().toISOString(), overdueTime, additionalCost);
      setIsStopped(true);
    }
  }, [isStopped, updateExpirationStatus]);

  return {
    imie, setImie, nazwisko, setNazwisko, email, setEmail, id, setId, cena, setCena, countdown, setCountdown, handleSendData, handleStopCountdown
  };
}
