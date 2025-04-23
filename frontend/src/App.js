import React, { useState, useEffect } from 'react';
import './App.css'; // Asegúrate de tener este archivo o crea tus propios estilos

function App() {
  const [facciones, setFacciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Para indicar si la carga está en curso

  useEffect(() => {
    fetch('http://localhost:5000/api/facciones') // La URL de tu backend para obtener las facciones
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setFacciones(data);
        setLoading(false); // La carga ha terminado
      })
      .catch(error => {
        console.error('Error al obtener las facciones:', error);
        setError(error.message);
        setLoading(false); // La carga ha terminado con un error
      });
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  if (loading) {
    return <div>Cargando facciones...</div>;
  }

  if (error) {
    return <div>Error al cargar las facciones: {error}</div>;
  }

  return (
    <div className="App">
      <h1>List Builder de Warhammer 40k</h1>
      <h2>Selecciona una facción:</h2>
      <select>
        <option value="">-- Selecciona una facción --</option>
        {facciones.map(faccion => (
          <option key={faccion.id_faccion} value={faccion.id_faccion}>
            {faccion.nombre}
          </option>
        ))}
      </select>
      {/* Aquí irán los componentes para mostrar las unidades de la facción seleccionada */}
    </div>
  );
}

export default App;