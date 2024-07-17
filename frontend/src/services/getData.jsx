import axios from 'axios';
import { useEffect, useState } from 'react';

export function getData() {
  const [data, setData] = useState([]);

  const handleGetData = async () => {
    try { 
      const res = await axios.get('https://crispy-xylophone-44q6rq6wwxjcjrjg-4000.app.github.dev/userData');
      setData(res.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return {data, setData, handleGetData};
}
