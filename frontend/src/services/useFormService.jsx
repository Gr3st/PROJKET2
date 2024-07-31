import { useState } from 'react';

export const useFormService = () => {
  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [cena, setCena] = useState('');
  const [countdown, setCountdown] = useState('');
  const [users, setUsers] = useState([]);

  const handleSendData = (userData) => {
    setUsers([...users, userData]);
  };

  const handleStopCountdown = (userId) => {
    setUsers(users.map(user => user.id === userId ? { ...user, countdown: '0:0:0' } : user));
  };

  return {
    imie,
    setImie,
    nazwisko,
    setNazwisko,
    email,
    setEmail,
    id,
    setId,
    cena,
    setCena,
    countdown,
    setCountdown,
    handleSendData,
    handleStopCountdown,
  };
};
