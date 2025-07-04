import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/ProblemDetails.css';

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/problems/${id}`)
      .then(res => setProblem(res.data))
      .catch(err => console.error('Error loading problem:', err));
  }, [id]);

  const handleSubmit = async () => {
    const userId = Cookies.get('userId'); // ✅ dynamic inside handler
    console.log(userId);
    if (!userId) {
      setResult('⚠️ Please login before submitting.');
      return;
    }
    setResult('⏳ Evaluating...');

    const payload = {
      code,
      language,
      problemId: id,
      userId,
    };

    console.log('📤 Submitting:', payload);

    try {
      const res = await axios.post('http://localhost:8000/run', payload);

      if (res.data.success) {
        setResult(`✅ ${res.data.result}`);
      } else {
        setResult(`❌ Error: ${res.data.error}`);
      }
    } catch (err) {
      console.error('Submission Error:', err.response?.data || err.message);
      setResult('❌ An error occurred while submitting your code.');
    }
  };

  if (!problem) return <p>Loading problem...</p>;

  return (
    <div className="problem-detail-container" style={{ display: 'flex', gap: '2rem' }}>
      <div className="problem-description" style={{ flex: 2 }}>
        <h1>{problem.name}</h1>
        <p><strong>Difficulty:</strong> {problem.difficulty}</p>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{problem.statement}</pre>
      </div>

      <div className="submission-panel" style={{ flex: 1 }}>
        <h3>Submit Solution</h3>
        <label>Language:</label>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="cpp">C++</option>
          {/* Add more languages later */}
        </select>

        <textarea
          rows="15"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Write your code here..."
          style={{ width: '100%', marginTop: '1rem' }}
        />

        <button className="btn primary" onClick={handleSubmit} style={{ marginTop: '1rem' }}>
          Submit
        </button>

        {result && (
          <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', color: result.startsWith('✅') ? 'green' : 'red' }}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
