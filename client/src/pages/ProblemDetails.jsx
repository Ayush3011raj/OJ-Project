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
  const [aiFeedback, setAiFeedback] = useState(''); // 🆕 for AI review output

  useEffect(() => {
    axios.get(`http://localhost:5000/api/problems/${id}`)
      .then(res => setProblem(res.data))
      .catch(err => console.error('Error loading problem:', err));
  }, [id]);

  const handleSubmit = async () => {
    const userId = Cookies.get('userId');
    if (!userId) {
      setResult('⚠️ Please login before submitting.');
      return;
    }
    setResult('⏳ Evaluating...');
    try {
      const res = await axios.post('http://localhost:8000/run', {
        code,
        language,
        problemId: id,
        userId
      });

      setResult(res.data.success ? `✅ ${res.data.result}` : `❌ Error: ${res.data.error}`);
    } catch (err) {
      console.error('Submission Error:', err.response?.data || err.message);
      setResult('❌ An error occurred while submitting your code.');
    }
  };

  const handleAIReview = async () => {
    setAiFeedback('🤖 Reviewing your code with AI...');
    try {
      const res = await axios.post('http://localhost:5000/ai-review', { code, language });
      setAiFeedback(res.data.feedback || 'No feedback available.');
    } catch (err) {
      console.error('AI Review Error:', err);
      setAiFeedback('❌ AI review failed.');
    }
  };

  if (!problem) return <p>Loading problem...</p>;

  return (
    <div className="problem-detail-container">
      <div className="problem-description">
        <h1>{problem.name}</h1>
        <p><strong>Difficulty:</strong> {problem.difficulty}</p>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{problem.statement}</pre>
      </div>

      <div className="submission-panel">
        <h3>Submit Solution</h3>

        <label>Language:</label>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="cpp">C++</option>
        </select>

        <textarea
          rows="15"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Write your code here..."
        />

        <button className="btn primary" onClick={handleSubmit}>Submit</button>
        <button className="btn secondary" onClick={handleAIReview}>AI Review</button>

        {result && (
          <div className="result-box" style={{ marginTop: '1rem' }}>
            <strong>Verdict:</strong><br />
            <span style={{ color: result.startsWith('✅') ? 'green' : 'red' }}>{result}</span>
          </div>
        )}

        {aiFeedback && (
          <div className="ai-feedback-box">
            <strong>AI Feedback:</strong>
            <pre>{aiFeedback}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
