import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/Form.css'

export default function AddProblem() {
  const [form, setForm] = useState({ name: '', statement: '', code: '', difficulty: '' });
  const navigate = useNavigate();
  const token = Cookies.get('token');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/problems', form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/problems');
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Add New Problem</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <textarea name="statement" placeholder="Statement" onChange={handleChange} required />
      <input name="code" placeholder="Code" onChange={handleChange} required />
      <input name="difficulty" placeholder="Difficulty" onChange={handleChange} />
      <button className="btn primary full-width" type="submit">Create Problem</button>
    </form>
  );
}
