import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';
import Cookies from 'js-cookie';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password
      });
      setMessage('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // ✅ redirect to login
      }, 1500);
    } catch (err) {
      setMessage('Signup failed. Email may already be in use.');
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Create your Ayushforces Account</h2>
      <input
        type="text"
        placeholder="Name"
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className="btn secondary full-width" type="submit">Signup</button>
      {message && (
        <p style={{ color: message.includes('successful') ? 'green' : 'red', marginTop: '1rem' }}>
          {message}
        </p>
      )}
    </form>
  );
}
