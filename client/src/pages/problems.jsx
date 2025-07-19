import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/Problems.css'

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://13.203.102.213:5000/api/problems')
      .then(res => setProblems(res.data));

    const token = Cookies.get('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      axios.get('http://13.203.102.213:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data.role === 'admin') setIsAdmin(true);
      });
    }
  }, []);

  return (
    <div className="problem-page">
      <h1>All Problems</h1>
      {isAdmin && <button onClick={() => navigate('/add-problem')}>Add New Problem</button>}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Difficulty</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {problems.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td><Link to={`/problem/${p._id}`}>{p.name}</Link></td>
              <td>{p.difficulty}</td>
              {isAdmin && (
                <td>
                  <Link to={`/edit-problem/${p._id}`}><button>Edit</button></Link>
                  <button onClick={async () => {
                   const token = Cookies.get('token');
                    await axios.delete(`http://13.203.102.213:5000/api/problems/${p._id}`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    setProblems(problems.filter(pr => pr._id !== p._id));
                  }}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
