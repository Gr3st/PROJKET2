import axios from 'axios';
import { useState } from 'react';

export function useGetData() {
  const [data, setData] = useState([]);

  const handleGetData = async () => {
    try {
      const res = await axios.get('https://projket2.onrender.com/userData');
      setData(res.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return { data, setData, handleGetData };
}
