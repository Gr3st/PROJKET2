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
      const res = await axios.post('https://fluffy-succotash-7q7wx7wpp9w2rx9r-4000.app.github.dev/addPrice', postData);
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

    const header = ['Imie', 'Nazwisko', 'Email', 'ID', 'Cena', 'Data Wejscia', 'Data Wyjscia', 'Odliczanie', 'Calkowity Czas'];
    const rows = data.map(user => [
      formatCell(user.imie || ''),
      formatCell(user.nazwisko || ''),
      formatCell(user.email || ''),
      formatCell(user.id || ''),
      formatCell(Math.floor((new Date(user.exitDate).getTime() - new Date(user.entryDate).getTime()) / 1000)>=user.countdown?`${Math.ceil((((Date.now() - new Date(user.exitDate).getTime())/1000)/60)*1.5)}zl`:`${user.cena}zl`),
      formatCell(user.entryDate ? new Date(user.entryDate).toLocaleDateString() : ''),
      formatCell(user.exitDate ? new Date(user.exitDate).toLocaleDateString() : ''),
      formatCell(user.countdown || ''),
      formatCell(user.entryDate && user.exitDate ? Math.floor((new Date(user.exitDate).getTime() - new Date(user.entryDate).getTime()) / 1000) : '')
    ]);

    const csvContent = [
      header.join(';'),
      ...rows.map(e => e.join(';'))
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = async () => {
    await handleGetData(); // Fetch data before generating CSV
    if (!data || data.length === 0) {
      console.error('No data available to generate CSV');
      return;
    }
    
    const csv = generateCSV(data);
    if (!csv) return; // If no data to generate CSV

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
