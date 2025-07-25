import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "../styles/ProblemDetails.css";

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [pastSubmissions, setPastSubmissions] = useState([]);

  const fetchSubmissions = async () => {
    const userId = Cookies.get("userId");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/submissions/user/${userId}/problem/${id}`,
        {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        }
      );
      // ✅ Inject showCode field to each submission
      const submissionsWithToggle = res.data.map((sub) => ({
        ...sub,
        showCode: false,
      }));
      setPastSubmissions(submissionsWithToggle);
      setShowSubmissions((prev) => !prev);
    } catch (err) {
      console.error("Error fetching submissions", err);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/problems/${id}`)
      .then((res) => setProblem(res.data))
      .catch((err) => console.error("Error loading problem:", err));
  }, [id]);

  const handleSubmit = async () => {
    const userId = Cookies.get("userId");
    if (!userId) {
      setResult("⚠️ Please login before submitting.");
      return;
    }
    setResult("⏳ Evaluating...");
    try {
      const res = await axios.post("http://localhost:8000/run", {
        code,
        language,
        problemId: id,
        userId,
      });

      if (res.data.success) {
        const verdict = res.data.result;
        if (verdict.includes("Time Limit")) {
          setResult("⏱️ TLE: Time Limit Exceeded");
        } else if (verdict.includes("Memory Limit")) {
          setResult("💾 MLE: Memory Limit Exceeded");
        } else if (verdict.includes("Wrong Answer")) {
          setResult(`❌ ${verdict}`);
        } else {
          setResult(`✅ ${verdict}`);
        }
      } else {
        setResult(`❌ Error: ${res.data.error}`);
      }
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);
      setResult("❌ An error occurred while submitting your code.");
    }
  };

  const handleAIReview = async () => {
    setAiFeedback("🤖 Reviewing your code with AI...");
    try {
      const res = await axios.post("http://localhost:5000/ai-review", {
        code,
        language,
      });
      setAiFeedback(res.data.feedback || "No feedback available.");
    } catch (err) {
      console.error("AI Review Error:", err);
      setAiFeedback("❌ AI review failed.");
    }
  };

  const handleRun = async () => {
    setCustomOutput("⏳ Running with custom input...");
    try {
      const res = await axios.post("http://localhost:8000/run-custom", {
        code,
        language,
        input: customInput,
      });

      if (res.data.success) {
        const output = res.data.output;
        if (output.includes("Time Limit")) {
          setCustomOutput("⏱️ TLE: Time Limit Exceeded");
        } else if (output.includes("Memory Limit")) {
          setCustomOutput("💾 MLE: Memory Limit Exceeded");
        } else {
          setCustomOutput(output);
        }
      } else {
        setCustomOutput(`❌ Error: ${res.data.error}`);
      }
    } catch (err) {
      console.error("Custom Run Error:", err);
      setCustomOutput("❌ An error occurred while running the code.");
    }
  };

  if (!problem) return <p>Loading problem...</p>;

  return (
    <div className="problem-detail-container">
      <div className="problem-description">
        <button className="btn small" onClick={fetchSubmissions}>
          {showSubmissions ? "Hide Past Submissions" : "Show Past Submissions"}
        </button>
        <h1>{problem.name}</h1>
        <p>
          <strong>Difficulty:</strong> {problem.difficulty}
        </p>
        <pre style={{ whiteSpace: "pre-wrap" }}>{problem.statement}</pre>

        {showSubmissions && (
          <div className="past-submissions-box">
            <h4>📜 Your Past Submissions</h4>
            {pastSubmissions.length === 0 ? (
              <p>No submissions found.</p>
            ) : (
              <table className="submission-table">
                <thead>
                  <tr>
                    <th>Verdict</th>
                    <th>Time</th>
                    <th>Code</th>
                  </tr>
                </thead>
                <tbody>
                  {pastSubmissions.map((s, idx) => (
                    <tr key={idx}>
                      <td
                        style={{
                          color: s.verdict.includes("Accepted")
                            ? "green"
                            : s.verdict.includes("Time Limit")
                            ? "orange"
                            : s.verdict.includes("Memory Limit")
                            ? "purple"
                            : "red",
                        }}
                      >
                        {s.verdict}
                      </td>
                      <td>{new Date(s.createdAt).toLocaleString()}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          className="btn small"
                          onClick={() =>
                            setPastSubmissions((prev) =>
                              prev.map((sub, i) =>
                                i === idx
                                  ? { ...sub, showCode: !sub.showCode }
                                  : sub
                              )
                            )
                          }
                        >
                          👁
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pastSubmissions.map(
                    (s, idx) =>
                      s.showCode && (
                        <tr key={`code-${idx}`}>
                          <td colSpan="3">
                            <pre
                              style={{
                                backgroundColor: "#f6f6f6",
                                padding: "1rem",
                                borderRadius: "5px",
                                fontSize: "14px",
                              }}
                            >
                              {s.code}
                            </pre>
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <div className="submission-panel">
        <h3>Code Editor</h3>

        <label>Language:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="cpp">C++</option>
        </select>

        <textarea
          rows="15"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
        />

        <label style={{ marginTop: "1rem" }}>Custom Input:</label>
        <textarea
          rows="5"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Enter custom input here..."
        />

        <div className="button-group">
          <button className="btn primary" onClick={handleRun}>
            Run
          </button>
          <button className="btn success" onClick={handleSubmit}>
            Submit
          </button>
          <button className="btn secondary" onClick={handleAIReview}>
            AI Review
          </button>
        </div>

        {customOutput && (
          <div className="custom-output-box">
            <strong>Custom Output:</strong>
            <pre
              style={{
                color: customOutput.includes("TLE")
                  ? "orange"
                  : customOutput.includes("MLE")
                  ? "purple"
                  : customOutput.startsWith("❌")
                  ? "red"
                  : "black",
              }}
            >
              {customOutput}
            </pre>
          </div>
        )}

        {result && (
          <div className="result-box">
            <strong>Verdict:</strong>
            <pre
              style={{
                color: result.startsWith("✅")
                  ? "green"
                  : result.includes("TLE")
                  ? "orange"
                  : result.includes("MLE")
                  ? "purple"
                  : "red",
              }}
            >
              {result}
            </pre>
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
