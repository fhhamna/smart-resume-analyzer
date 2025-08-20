import React, { useState } from "react";


function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile.size > 5 * 1024 * 1024) { // 5 MB
    alert("File is too large! Maximum size is 5 MB.");
    return;
  }
  setFile(selectedFile);
};

  const handleUpload = () => {
    if (!file) return alert("Please select a PDF file!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setRawText(data.raw_text);
        setParsedData(data.parsed_data);
      })
      .catch((err) => {
        console.error(err);
        alert("Error uploading resume. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const handleReset = () => {
    setFile(null);
    setRawText("");
    setParsedData(null);
  };

  return (
    <div className="p-6 border rounded bg-white shadow">
      <h2 className="text-xl font-bold">Upload Resume</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mt-4"
      />

      <div className="mt-2 flex space-x-2">
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-500"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded bg-purple-500 text-white"
        >
          Reset
        </button>
      </div>

      {/* Show Parsed Data in Card Layout */}
      {parsedData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Personal Info */}
          <div className="bg-white p-4 rounded-xl shadow border">
            <h3 className="font-bold text-lg mb-2">Personal Info</h3>
            <p><b>Name:</b> {parsedData.name || "Not found"}</p>
            <p><b>Email:</b> {parsedData.email || "Not found"}</p>
            <p><b>Phone:</b> {parsedData.phone || "Not found"}</p>
          </div>

          {/* Education */}
          <div className="bg-white p-4 rounded-xl shadow border">
            <h3 className="font-bold text-lg mb-2">Education</h3>
            {parsedData.education?.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {parsedData.education.map((edu, idx) => (
                  <li key={idx}>{edu}</li>
                ))}
              </ul>
            ) : (
              <p>No education details found</p>
            )}
          </div>

          {/* Experience */}
          <div className="bg-white p-4 rounded-xl shadow border">
            <h3 className="font-bold text-lg mb-2">Experience</h3>
            {parsedData.experience?.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {parsedData.experience.map((exp, idx) => (
                  <li key={idx}>{exp}</li>
                ))}
              </ul>
            ) : (
              <p>No experience details found</p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white p-4 rounded-xl shadow border">
            <h3 className="font-bold text-lg mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {parsedData.skills?.length ? (
                parsedData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm shadow"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p>No skills detected</p>
              )}
            </div>
          </div>
        </div>
      )}

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