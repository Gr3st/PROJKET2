import axios from 'axios';
import { useState } from 'react';

export function useGetData() {
  const [data, setData] = useState([]);

  const handleGetData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/userData');
      setData(res.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return { data, setData, handleGetData };
}
