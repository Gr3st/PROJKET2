import axios from 'axios';
import { useState } from 'react';

export function useGetPrice() {
  const [dataPrice, setDataPrice] = useState([]);

  const handleGetPrice = async () => {
    try {
      const res = await axios.get('http://localhost:4000/getPrice');
      setDataPrice(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return { dataPrice, setDataPrice, handleGetPrice };
}
