import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/ProblemDetails.css'

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/problems/${id}`)
      .then(res => setProblem(res.data));
  }, [id]);

  const handleSubmit = () => {
    alert('Submission captured. Evaluation logic coming soon!');
    console.log({ language, code });
  };

  if (!problem) return <p>Loading...</p>;

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
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
        <textarea
          rows="15"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Write your code here..."
          style={{ width: '100%', marginTop: '1rem' }}
        />
        <button className="btn primary" onClick={handleSubmit} style={{ marginTop: '1rem' }}>Submit</button>
      </div>
    </div>
  );
}
