import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [facciones, setFacciones] = useState([]);
  const [selectedFaction, setSelectedFaction] = useState(''); // Estado para la facción seleccionada
  const [unidades, setUnidades] = useState([]); // Estado para las unidades de la facción seleccionada
  const [error, setError] = useState(null);
  const [loadingFacciones, setLoadingFacciones] = useState(true);
  const [loadingUnidades, setLoadingUnidades] = useState(false); // Nuevo estado para la carga de unidades

  useEffect(() => {
    setLoadingFacciones(true);
    fetch('http://localhost:5000/api/facciones')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setFacciones(data);
        setLoadingFacciones(false);
      })
      .catch(error => {
        console.error('Error al obtener las facciones:', error);
        setError(error.message);
        setLoadingFacciones(false);
      });
  }, []);

  useEffect(() => {
    if (selectedFaction) {
      setLoadingUnidades(true);
      fetch(`http://localhost:5000/api/unidades/${selectedFaction}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setUnidades(data);
          setLoadingUnidades(false);
        })
        .catch(error => {
          console.error(`Error al obtener las unidades de la facción ${selectedFaction}:`, error);
          setError(error.message);
          setLoadingUnidades(false);
        });
    } else {
      setUnidades([]); 
    }
  }, [selectedFaction]); // Este efecto se ejecuta cuando cambia selectedFaction

  const handleFactionChange = (event) => {
    setSelectedFaction(event.target.value);
  };

  if (loadingFacciones) {
    return <div>Cargando facciones...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>List Builder de Warhammer 40k</h1>
      <h2>Selecciona una facción:</h2>
      <select value={selectedFaction} onChange={handleFactionChange}>
        <option value="">-- Selecciona una facción --</option>
        {facciones.map(faccion => (
          <option key={faccion.id_faccion} value={faccion.id_faccion}>
            {faccion.nombre}
          </option>
        ))}
      </select>

      {selectedFaction && (
        <div>
          <h3>Unidades de {facciones.find(f => f.id_faccion === parseInt(selectedFaction))?.nombre || 'Facción Seleccionada'}</h3>
          {loadingUnidades ? (
            <div>Cargando unidades...</div>
          ) : (
            <ul>
              {unidades.map(unidad => (
                <li key={unidad.id_unidad}>
                  {unidad.nombre} (Puntos: {unidad.coste_puntos})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;