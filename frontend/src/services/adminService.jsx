import axios from 'axios';
import { useEffect, useState } from 'react';
import { getData } from './getData';

export function adminService() {
  const [czas, setCzas] = useState('');
  const [cena, setCena] = useState('');
  const [postData, setPostData] = useState({});
  const { data, handleGetData } = getData(); // Usunięto setData, ponieważ nie jest używane

  useEffect(() => {
    setPostData({ czas, cena });
  }, [czas, cena]);

  const handleSetPrice = async () => {
    try {
      console.log('Sending data:', postData);
      const res = await axios.post('https://crispy-xylophone-44q6rq6wwxjcjrjg-4000.app.github.dev/addPrice', postData);
      console.log('Response:', res);
      setCena('');
      setCzas('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const generateCSV = (data) => {
    if (!data.length) {
      console.error('No data available to generate CSV');
      return '';
    }

    const header = ['Imię', 'Nazwisko', 'Email', 'ID', 'Cena', 'Data Wejścia', 'Data Wyjścia', 'Odliczanie'];
    const rows = data.map(user => [
      user.imie || '',
      user.nazwisko || '',
      user.email || '',
      user.id || '',
      user.cena || '',
      new Date(user.entryDate).toLocaleDateString() || '',
      user.exitDate ? new Date(user.exitDate).toLocaleDateString() : '',
      user.countdown || ''
    ]);

    const csvContent = [
      header.join(';'),
      ...rows.map(e => e.join(';'))
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = async () => {
    await handleGetData(); // Pobiera dane przed generowaniem CSV
    const csv = generateCSV(data);
    if (!csv) return; // Jeśli nie ma danych do wygenerowania CSV

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    cena,
    setCena,
    czas,
    setCzas,
    handleSetPrice,
    downloadCSV
  };
}
