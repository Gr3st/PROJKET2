import '../style/userForm.css';
import { formService } from '../services/formService';

function userForm() {
  const { imie, setImie, nazwisko, setNazwisko, email, setEmail, id, setId, handleSendData } = formService();
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendData();
    }
  };

  return (
    <div className="user-form">
      <input type="text" placeholder='Imie' value={imie} onChange={(e) => setImie(e.target.value)} onKeyDown={handleKeyPress}/>
      <input type="text" placeholder='Nazwisko' value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} onKeyDown={handleKeyPress}/>
      <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyPress}/>
      <input type="text" placeholder='ID' value={id} onChange={(e) => setId(e.target.value)} onKeyDown={handleKeyPress}/>
      <button onClick={handleSendData}>Dodaj Dziecko</button>
    </div>
  );
}

export default userForm;
