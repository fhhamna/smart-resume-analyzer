import React from "react";
import ResumeUpload from "../components/ResumeUpload";
import JobDescription from "../components/JobDescription"; 
import MatchResults from "../components/MatchResults";
/*import ActionButtons from "../components/ActionButtons";*/

function Dashboard() {
  return (
      <div className="Dashboard">
      <h1 className="text">Smart Resume Analyzer</h1>
      {/* Step 1: Add Job Description */}
      <JobDescription />

      {/* Step 2: Upload Resume */}
      <ResumeUpload />

      {/* Step 3: Match Resume */}
      <MatchResults />

      {/* Step 4: Action Buttons */}
      
    </div>
  );
}

export default Dashboard;
