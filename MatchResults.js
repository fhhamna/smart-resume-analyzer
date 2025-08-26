import React, { useState } from "react";

const MatchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMatches = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/match");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch match results");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (filename, score, decision) => {
    try {
      const response = await fetch("http://localhost:5000/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, score, decision }),
      });
      const data = await response.json();
      console.log("Decision saved:", data);
      alert(`Saved: ${filename} → ${decision}`);
    } catch (error) {
      console.error("Error saving decision:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Resume Match Results</h2>
      <button
        onClick={fetchMatches}
        className="mb-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Get Match Scores
      </button>

      {loading && <p className="text-gray-600">Loading match results...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {results.length > 0 && (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-4 py-2 border">Filename</th>
              <th className="px-4 py-2 border">Match Score</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res, idx) => {
              const percent = Math.round(res.score * 100);
              return (
                <tr key={idx} className="hover:bg-purple-50">
                  <td className="px-4 py-2 border">{res.filename}</td>
                  <td className="px-4 py-2 border font-bold">{percent}%</td>
                  <td className="px-4 py-2 border">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          percent >= 70
                            ? "bg-green-500"
                            : percent >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-2 border flex space-x-2">
                    <button
                      onClick={() =>
                        handleDecision(res.filename, res.score, "Accept")
                      }
                      className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleDecision(res.filename, res.score, "Waitlist")
                      }
                      className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      Waitlist
                    </button>
                    <button
                      onClick={() =>
                        handleDecision(res.filename, res.score, "Reject")
                      }
                      className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {results.length === 0 && !loading && !error && (
        <p className="text-gray-500">
          No match results found. Click the button to fetch.
        </p>
      )}
    </div>
  );
};

export default MatchResults;
