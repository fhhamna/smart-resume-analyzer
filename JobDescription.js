import React, { useState } from "react";

export default function JobDescription() {
  const [jd, setJd] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/upload_jd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ job_description: jd }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error uploading Job Description");
    }
  };

  return (
    <div className="job-description-container">
      <h2>Enter Job Description</h2>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste job description here..."
        ></textarea>
        <button onClick={handleSubmit}>Submit JD</button>
        {message && <p className="message">{message}</p>} 
      </div>

  );
}
