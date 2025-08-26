import React, { useState } from "react";
import "./Style.css"


function ResumeUpload() {
  const [files, setFiles] = useState([]);
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFilesChange = (e) => {
  setFiles(e.target.files);  // stores all selected files
};

  const handleUpload = async () => {
  if (files.length === 0) return alert("Please select at least one PDF file!");

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("resumes", files[i]); // key must match backend
  }

  setLoading(true);
  try {
    const res = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setRawText(data.parsed_resumes.map(r => r.raw_text).join("\n\n---\n\n"));
    setParsedData(data.parsed_resumes.map(r => r.parsed_data)); // first resume
  } catch (err) {
    console.error(err);
    alert("Error uploading resumes. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleReset = () => {
    setFiles([]);
    setRawText("");
    setParsedData([]);
  };

  return (
<div className="upload-container">
  <h2 className="upload-heading">Upload Resume</h2>

  <div className="dropzone">
    <p>Drag & drop your PDF here, or click the button below</p>
    <button
      className="select-button"
      onClick={() => document.getElementById("fileInput").click()}
    >
      Select File
    </button>
    <input
      type="file"
      id="fileInput"
      multiple
      accept=".pdf"
      onChange={handleFilesChange}
      className="file-input"
    />
  </div>

  <div className="buttons">
    <button
      onClick={handleUpload}
      disabled={loading}
      className={`upload-btn ${loading ? "disabled" : ""}`}
    >
      {loading ? "Uploading..." : "Upload"}
    </button>

    <button onClick={handleReset} className="reset-btn">
      Reset
    </button>
  </div>


      {/* Show Parsed Data in Card Layout */}
      {parsedData && parsedData.map((resume, idx) => (
  <div key={idx} className="bg-white p-4 rounded-xl shadow border mt-6">
    <h2 className="text-lg font-bold mb-2">{resume.filename}</h2>

    {/* Education */}
    <div>
      <h3 className="font-bold">Education</h3>
      {resume.education?.length ? (
        <ul className="list-disc pl-5">
          {resume.education.map((edu, i) => <li key={i}>{edu}</li>)}
        </ul>
      ) : <p>No education details found</p>}
    </div>

    {/* Experience */}
    <div>
      <h3 className="font-bold">Experience</h3>
      {resume.experience?.length ? (
        <ul className="list-disc pl-5">
          {resume.experience.map((exp, i) => <li key={i}>{exp}</li>)}
        </ul>
      ) : <p>No experience details found</p>}
    </div>

    {/* Skills */}
    <div>
      <h3 className="font-bold">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {resume.skills?.length ? (
          resume.skills.map((skill, i) => (
            <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm shadow">
              {skill}
            </span>
          ))
        ) : <p>No skills detected</p>}
      </div>
    </div>
  </div>
))}

      {/* Show Raw Resume Text (optional) */}
      {rawText && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-bold">Extracted Resume Text:</h3>
          <pre className="whitespace-pre-wrap text-sm">{rawText}</pre>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;