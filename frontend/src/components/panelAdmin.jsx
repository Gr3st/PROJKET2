import React, { useEffect } from 'react';
import { adminService } from '../services/adminService';

const PanelAdmin = () => {
  const { cena, setCena, czas, setCzas, handleSetPrice } = adminService();

  return (
    <div>
      <h2>Panel Administracyjny</h2>
      <div>
        <h3>Ustaw Limity Czasowe</h3>
        
      </div>
      <div>
        <h3>Ustaw Czas</h3>
        <input type="text" value={czas} onChange={(e) => setCzas(e.target.value)} />
        <h3>Ustaw Ceny</h3>
        <input type="text" value={cena} onChange={(e) => setCena(e.target.value)} />
        <button onClick={handleSetPrice}>DODAJ</button>
      </div>

    </div>
  );
};

export default PanelAdmin;
