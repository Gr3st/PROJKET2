import axios from 'axios';
import { useState } from 'react';

export function useGetData() {
  const [data, setData] = useState([]);

  const handleGetData = async () => {
    try {
      const res = await axios.get('https://fluffy-succotash-7q7wx7wpp9w2rx9r-4000.app.github.dev/userData');
      setData(res.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return { data, setData, handleGetData };
}
