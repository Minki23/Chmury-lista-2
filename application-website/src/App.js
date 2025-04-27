import { useEffect, useState } from 'react';

export default function App() {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch('http://localhost:3003/positions');
        const data = await res.json();
        setPositions(data.map((pos) => pos.name));
      } catch (err) {
        console.error('Failed to load positions', err);
      }
    };
  
    fetchPositions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cvFile || !selectedPosition) {
      alert('Wybierz stanowisko i załaduj CV.');
      return;
    }
  
    const formData = new FormData();
    formData.append('position', selectedPosition);
    formData.append('resume', cvFile);
  
    try {
      const response = await fetch('http://localhost:3001/applications', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        alert('Aplikacja została przesłana!');
      } else {
        alert('Wystąpił błąd przy wysyłaniu aplikacji.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('Wystąpił błąd przy wysyłaniu aplikacji.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #111827, #000)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>Cybernovate Careers</h1>
      <form onSubmit={handleSubmit} style={{ background: '#1f2937', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 0 20px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div>
          <label style={{ color: 'white', marginBottom: '0.5rem', display: 'block' }}>Wybierz stanowisko</label>
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#374151', color: 'white', border: 'none' }}
          >
            <option value="">-- Wybierz --</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ color: 'white', marginBottom: '0.5rem', display: 'block' }}>Wgraj CV (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#374151', color: 'white', border: 'none' }}
          />
        </div>

        <button type="submit" style={{ backgroundColor: '#06b6d4', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          Wyślij aplikację
        </button>

      </form>
    </div>
  );
}