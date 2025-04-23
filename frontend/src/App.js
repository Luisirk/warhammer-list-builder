import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [facciones, setFacciones] = useState([]);
  const [selectedFaction, setSelectedFaction] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [userList, setUserList] = useState([]); // Nuevo estado para la lista del usuario
  const [error, setError] = useState(null);
  const [loadingFacciones, setLoadingFacciones] = useState(true);
  const [loadingUnidades, setLoadingUnidades] = useState(false);

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
  }, [selectedFaction]);

  const handleFactionChange = (event) => {
    setSelectedFaction(event.target.value);
  };

  const handleAddToList = (unidad) => {
    setUserList([...userList, unidad]); // Añade la unidad al array userList
  };

  const handleRemoveFromList = (unidadToRemove) => {
    setUserList(userList.filter(unidad => unidad.id_unidad !== unidadToRemove.id_unidad));
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
                  <button onClick={() => handleAddToList(unidad)}>Añadir a la lista</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <h2>Tu Lista:</h2>
      {userList.length === 0 ? (
        <p>Tu lista está vacía.</p>
      ) : (
        <ul>
          {userList.map(unidadEnLista => (
            <li key={unidadEnLista.id_unidad}>
              {unidadEnLista.nombre} (Puntos: {unidadEnLista.coste_puntos})
              <button onClick={() => handleRemoveFromList(unidadEnLista)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;