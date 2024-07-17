import axios from 'axios';
import { useEffect, useState } from 'react';

export function formService() {
  const [imie, setImie] = useState('');
  const [nazwisko, setNazwisko] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [postData, setPostData] = useState({});

  useEffect(()=>{
    setPostData({imie, nazwisko, email, id});
  },[imie, nazwisko, email, id]);
  const handleSendData = async () => {
    try { 
      console.log('Sending data:', postData);
      const res = await axios.post('https://crispy-xylophone-44q6rq6wwxjcjrjg-4000.app.github.dev/user', postData);
      console.log('Response:', res);
      setImie('');
      setNazwisko('');
      setEmail('');
      setId('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return {
    imie, setImie, nazwisko, setNazwisko, email, setEmail, id, setId, handleSendData,
  };
}
