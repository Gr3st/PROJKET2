import axios from 'axios';
import { useEffect, useState } from 'react';
import { useGetData } from './useGetData';

export function useAdminService() {
  const [czas, setCzas] = useState('');
  const [cena, setCena] = useState('');
  const [postData, setPostData] = useState({});
  const { data, handleGetData } = useGetData();

  useEffect(() => {
    setPostData({ czas, cena });
  }, [czas, cena]);

  const handleSetPrice = async () => {
    try {
      console.log('Sending data:', postData);
      const res = await axios.post('https://projket2.onrender.com/addPrice', postData);
      console.log('Response:', res);
      setCena('');
      setCzas('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const formatCell = (value) => {
    if (typeof value === 'string' && value.includes(';')) {
      return `"${value.replace(/"/g, '""')}"`; // Enclose in double quotes if it contains a separator
    }
    return value;
  };

  const generateCSV = (data) => {
    if (!data.length) {
      console.error('No data available to generate CSV');
      return '';
    }

    const header = ['Imie', 'Nazwisko', 'Email', 'ID', 'Cena', 'Data Wejscia', 'Data Wyjscia', 'Odliczanie', 'realny-czas'];
    const rows = data.map(user => [
      formatCell(user.imie || ''),
      formatCell(user.nazwisko || ''),
      formatCell(user.email || ''),
      formatCell(user.id || ''),
      formatCell(user.cena+"zł" || ''),
      formatCell(new Date(user.entryDate).toLocaleDateString() || ''),
      formatCell(user.exitDate ? new Date(user.exitDate).toLocaleDateString() : ''),
      formatCell(user.countdown || ''),
      formatCell((user.entryDate.getTime() - user.exitDate.getTime())/1000)
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
