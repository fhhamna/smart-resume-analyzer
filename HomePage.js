import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import HireWiseLogo from "../img/HireWiseLogo.png";
import './style/Navbar.css'; 
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';


function HomePage() {
  return (
    <div className='bg'>
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white">
       {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
        <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
         <ul className="navbar-nav mx-auto"> 
            <li className="nav-item">
                <a className="nav-link" href="#HowItWorks">How it works</a>
            </li>
             <li className="nav-item">
                <a className="nav-link" href="#">Chat with us</a>
            </li>
             <li className="nav-item">
                <a className="nav-link" href="#">About</a>
            </li>
          </ul>
        </div>
     </div>
    </nav>

          {/* Logo */}
          <a className="navbar-brand" href="#">
            <img 
              src={HireWiseLogo} 
              alt="HireWise Logo" 
              className='logo' 
            />
          </a>


      <div className="container text-center mt-5">
        <h1 className="mb-4">Match resumes with job descriptions automatically and highlight the best candidates using AI-driven analysis.</h1>
        <p className="lead">AI-Powered Resume Analyzer for Smarter Hiring</p>
      </div>
      
          {/* Toggle for mobile */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
            <span className="navbar-toggler-icon"></span>
          </button>
          
             {/* Buttons */}

            <div className="buttons">
              <Link to="/Dashboard">
                <button type="button" className="btn-1">Dashboard</button>
              </Link>
            </div>
            </div>


            
            {/* Why Choose Us Section */}
  <div class="container-why-choose-us">        
  <h1 class="WhyChoose">Why Choose HireWise?</h1>
  
  <div class="why-grid">
    <div class="why-box">
      <i class="fas fa-robot"></i>
      <h2>AI-Powered Matching</h2>
      <p>Smartly matches resumes with job descriptions for accuracy.</p>
    </div>
    
    <div class="why-box">
      <i class="fas fa-clock"></i>
      <h2>Faster Hiring</h2>
      <p>Save time by instantly shortlisting the best candidates.</p>
    </div>
    
    <div class="why-box">
      <i class="fas fa-lock"></i>
      <h2>Private & Secure</h2>
      <p>Your data is protected with enterprise-grade security.</p>
    </div>
    
    <div class="why-box">
      <i class="fas fa-users"></i>
      <h2>User-Friendly</h2>
      <p>Simple and intuitive interface for both recruiters and candidates.</p>
    </div>
    </div>
    <div class="why-box-mid">
      <i class="fas fa-chart-line"></i>
      <h2>Scalable</h2>
      <p>Works for small startups or large enterprises seamlessly.</p>
    </div>

  </div>

  <section class="how-it-works" href="#HowItWorks">
  <h1>How the System Works</h1>
  <div class="steps">
    <div class="step">
      <span class="number">1</span>
      <h2>Upload Resume</h2>
      <p>Recruiters upload Job seekers resumes in PDF format.</p>
    </div>
    <div class="step">
      <span class="number">2</span>
      <h2>Resume Parsing</h2>
      <p>The system extracts key details like skills, education, and experience using NLP.</p>
    </div>
    <div class="step">
      <span class="number">3</span>
      <h2>Job Description Matching</h2>
      <p>The resume is compared with job descriptions for semantic similarity.</p>
    </div>
    <div class="step">
      <span class="number">4</span>
      <h2>Score & Results</h2>
      <p>The system generates a Match Score and Highlights Strengths & Weaknesses.</p>
    </div>
  </div>
</section>


  <div>
  <h1 className='faqs'>FAQs</h1>
  <div className=''></div>
  </div>

  <footer className="footer text-black py-4">
  <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
    {/* Logo */}
    <div className="footer-logo mb-3 mb-md-0">
      <img src={HireWiseLogo} alt="HireWise Logo" style={{height: '50px'}}/>
    </div>

    {/* Links */}
    <div className="footer-links mb-3 mb-md-0">
      <a href="#" className="text-white mx-2">Home</a>
      <a href="#" className="text-white mx-2">How it Works</a>
      <a href="#" className="text-white mx-2">About</a>
      <a href="#" className="text-white mx-2">Contact</a>
    </div>

    {/* Social Icons */}
    <div className="footer-social">
      <i className="fab fa-linkedin mx-2"></i>
      <i className="fab fa-twitter mx-2"></i>
      <i className="fab fa-github mx-2"></i>
    </div>
  </div>

  <div className="text-center mt-3">
    © 2025 HireWise. All rights reserved.
  </div>
</footer>

  


    </div>
    
    
    
  );
}

export default HomePage;
