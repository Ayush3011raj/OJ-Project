import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = Cookies.get("userId");
      const token = Cookies.get("token");

      try {
        const res = await axios.get(`http://13.203.102.213:5000/api/submissions/user/${userId}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  if (!data) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h2>👤 Your Profile</h2>
      <p><strong>Total Submissions:</strong> {data.total}</p>
      <p><strong>Accepted:</strong> {data.accepted}</p>
      <p><strong>Accuracy:</strong> {data.accuracy}%</p>

      <h3>📜 Recent Submissions</h3>
      <table>
        <thead>
          <tr>
            <th>Problem</th>
            <th>Verdict</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.submissions.map((s, i) => (
            <tr key={i}>
              <td>{s.problemId?.name || "Unknown"}</td>
              <td style={{ color: s.verdict.includes("Accepted") ? "green" : "red" }}>
                {s.verdict}
              </td>
              <td>{new Date(s.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
