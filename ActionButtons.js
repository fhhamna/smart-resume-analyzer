import React, { useState } from "react";

function ResumeList({ resumes }) {
  const handleDecision = async (filename, score, decision) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, score, decision }),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error saving decision:", error);
    }
  };

  return (
    <div>
      <h2>Resume Results</h2>
      {resumes.map((resume, index) => (
        <div key={index} className="p-3 border rounded mb-2">
          <p><b>File:</b> {resume.filename}</p>
          <p><b>Score:</b> {resume.score}</p>
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleDecision(resume.filename, resume.score, "Accept")}
            >
              Accept
            </button>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => handleDecision(resume.filename, resume.score, "Waitlist")}
            >
              Waitlist
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDecision(resume.filename, resume.score, "Reject")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResumeList;
