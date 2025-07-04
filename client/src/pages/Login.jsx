import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

      // ✅ Store token and role in cookies
      Cookies.set('token', res.data.token, { expires: 1 }); // expires in 1 day
      Cookies.set('role', res.data.user.role);
      Cookies.set('userId', res.data.user._id);
      console.log(res.data);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/problems'); // ✅ redirect to problem list
      }, 1000);
    } catch (err) {
      setMessage('Invalid email or password');
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h2>Login to Ayushforces</h2>
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
      <button className="btn primary full-width" type="submit">Login</button>
      {message && (
        <p style={{ color: message.includes('successful') ? 'green' : 'red', marginTop: '1rem' }}>
          {message}
        </p>
      )}
    </form>
  );
}
