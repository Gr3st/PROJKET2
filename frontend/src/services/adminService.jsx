import axios from 'axios';
import { useEffect, useState } from 'react';

export function adminService() {
  const [czas, setCzas] = useState('');
  const [cena, setCena] = useState('');
  const [postData, setPostData] = useState({});

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

  return {
    cena, setCena, czas, setCzas, handleSetPrice,
  };
}
