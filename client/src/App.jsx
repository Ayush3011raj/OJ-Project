import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from "./components/Navbar";
import Problems from './pages/problems';
import AddProblem from './pages/AddProblem';
import EditProblem from './pages/EditProblem';
import ProblemDetails from './pages/ProblemDetails';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) setHasToken(true);
    setTokenChecked(true);
  }, []);

  if (!tokenChecked) return <div>Loading Ayushforces...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/add-problem" element={<AddProblem />} />
        <Route path="/edit-problem/:id" element={<EditProblem />} />
        <Route path="/problem/:id" element={<ProblemDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}
