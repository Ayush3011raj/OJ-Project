import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/Form.css'

export default function EditProblem() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', statement: '', code: '', difficulty: '' });
  const navigate = useNavigate();
  const token = Cookies.get('token');

  useEffect(() => {
    axios.get(`http://13.203.102.213:5000/api/problems/${id}`)
      .then(res => setForm(res.data));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    await axios.put(`http://13.203.102.213:5000/api/problems/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/problems');
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Edit Problem</h2>
      <input name="name" value={form.name} onChange={handleChange} required />
      <textarea name="statement" value={form.statement} onChange={handleChange} required />
      <input name="code" value={form.code} onChange={handleChange} required />
      <input name="difficulty" value={form.difficulty} onChange={handleChange} />
      <button className="btn secondary full-width" type="submit">Update Problem</button>
    </form>
  );
}