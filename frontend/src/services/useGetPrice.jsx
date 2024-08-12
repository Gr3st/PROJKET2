import axios from 'axios';
import { useState } from 'react';

export function useGetPrice() {
  const [dataPrice, setDataPrice] = useState([]);

  const handleGetPrice = async () => {
    try {
      const res = await axios.get('https://fluffy-succotash-7q7wx7wpp9w2rx9r-4000.app.github.dev/getPrice');
      setDataPrice(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return { dataPrice, setDataPrice, handleGetPrice };
}
