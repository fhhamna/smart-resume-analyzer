from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import fitz
import spacy
import re
#from skillNer.skill_extractor_class import SkillExtractor
from sentence_transformers import SentenceTransformer, util
from db import insert_resume_decision, fetch_resumes


app = Flask(__name__)
CORS(app)

nlp = spacy.load("en_core_web_lg")

#Load MiniLM model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Pre-defined skills set
SKILLS = [
    "Python", "Java", "C++", "JavaScript", "React", "Node.js", "Flask", "Django",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes",
    "HTML", "CSS", "Tailwind", "Bootstrap"
]

# Temporary storage (you can replace with DB later)
resumes_data = []   # [{ "filename": "abc.pdf", "text": "...." }]
job_description = ""


def extract_text_from_pdf(pdf_file):
    """Extract raw text from uploaded PDF using PyMuPDF."""
    text = ""
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    for page in doc:
        text += page.get_text()
    return text
def parse_resume(text):
    doc = nlp(text)

    parsed = {
        "skills": [],
        "education": [],
        "experience": []
    }

    # Education
    edu_keywords = ["bachelor", "b.sc", "btech", "bs", "master", "m.sc", "msc", "mtech",
                    "phd", "degree", "university", "college", "diploma", "school"]
    for line in text.split("\n"):
        if any(keyword in line.lower() for keyword in edu_keywords):
            parsed["education"].append(line.strip())

    # Experience
    exp_keywords = ["experience", "internship", "work history", "employment", "professional background",
                    "company", "developer", "engineer", "manager", "analyst", "consultant"]
    for line in text.split("\n"):
        if any(keyword in line.lower() for keyword in exp_keywords) or re.search(r"\d+\s+years", line.lower()):
            parsed["experience"].append(line.strip())

    # Skills (case-insensitive regex match)
    parsed["skills"] = []
    for skill in SKILLS:
        if re.search(r"\b" + re.escape(skill) + r"\b", text, re.IGNORECASE):
            parsed["skills"].append(skill)

    return parsed

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is running!"})

@app.route('/upload', methods=['POST'])
def upload_resumes():
    global resumes_data
    if 'resumes' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    files = request.files.getlist("resumes")  
    results = []

    for file in files:
        filename = secure_filename(file.filename)

        if filename.endswith(".pdf"):
            raw_text = extract_text_from_pdf(file)
        else:
            raw_text = file.read().decode("utf-8")

        parsed_data = parse_resume(raw_text)
         # Store for semantic matching
        resumes_data.append({
            "filename": filename,
            "text": raw_text
        })

        results.append({
            "filename": filename,
            "raw_text": raw_text,
            "parsed_data": parsed_data
        })

    return jsonify({
        "job_description": job_description,
        "parsed_resumes": results
    })

# Temporary storage for JD
job_description_data = {}

@app.route('/upload_jd', methods=['POST'])
def upload_jd():
    global job_description
    data = request.get_json()
    jd_text = data.get("job_description", "")

    if jd_text.strip() == "":
        return jsonify({"message": "Job Description cannot be empty"}), 400

    job_description = jd_text
    return jsonify({"message": "Job Description received successfully!"})

@app.route("/match", methods=["GET"])
def match_resumes():
    if not job_description:
        return jsonify({"error": "No job description provided yet"}), 400
    if not resumes_data:
        return jsonify({"error": "No resumes uploaded yet"}), 400

    # Encode JD
    jd_embedding = model.encode(job_description, convert_to_tensor=True)

    results = []
    for resume in resumes_data:
        resume_embedding = model.encode(resume["text"], convert_to_tensor=True)
        similarity = util.cos_sim(jd_embedding, resume_embedding).item() 

        results.append({
            "filename": resume["filename"],
            "score": round(similarity, 2)
        })

    # Sort by score (highest first)
    results.sort(key=lambda x: x["score"], reverse=True)

    return jsonify(results)

@app.route("/clear_resumes", methods=["POST"])
def clear_resumes():
    global resumes_data
    resumes_data = []
    return jsonify({"message": "All uploaded resumes cleared!"})

# Save decision
@app.route('/api/decisions', methods=['POST'])
def save_decision():
    data = request.json
    filename = data.get("filename")
    score = data.get("score")
    decision = data.get("decision")

    if not filename or not decision:
        return jsonify({"error": "Filename and scores are required"}), 400

    insert_resume_decision(filename, score, decision)
    return jsonify({"message": "Decision saved successfully!"}), 201

# Fetch all decisions
@app.route("/api/decisions", methods=["GET"])
def get_decisions():
    resumes = fetch_resumes()
    return jsonify(resumes), 200


if __name__ == '__main__':
    app.run(debug=True)

