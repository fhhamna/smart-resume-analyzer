from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import fitz
import spacy
import re

app = Flask(__name__)
CORS(app)

nlp = spacy.load("en_core_web_sm")

# Pre-defined skills set
SKILLS = [
    "Python", "Java", "C++", "JavaScript", "React", "Node.js", "Flask", "Django",
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes",
    "HTML", "CSS", "Tailwind", "Bootstrap"
]

def extract_text_from_pdf(pdf_file):
    """Extract raw text from uploaded PDF using PyMuPDF."""
    text = ""
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    for page in doc:
        text += page.get_text()
    return text

def parse_resume(text):
    doc = nlp(text)

     # Initialize
    parsed = {
        "name": None,
        "email": None,
        "phone": None,
        "skills": [],
        "education": [],
        "experience": []
    }

    # Extract Name: use SpaCy PERSON entities
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            parsed["name"] = ent.text
            break

    # Phone regex
    phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?(\(?\d{2,3}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}", text)
    if phone_match:
        parsed["phone"] = phone_match.group()

    # Email regex
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    if email_match:
        parsed["email"] = email_match.group()

    # Education extraction
    edu_keywords = ["bachelor", "master", "phd", "degree", "university", "college", "diploma", "school"]
    for line in text.split("\n"):
        if any(keyword in line.lower() for keyword in edu_keywords):
            parsed["education"].append(line.strip())

    # Experience extraction
    exp_keywords = ["experience", "internship", "worked", "company", "developer", "engineer", "manager"]
    for line in text.split("\n"):
        if any(keyword in line.lower() for keyword in exp_keywords) or re.search(r"\d+\s+years", line.lower()):
            parsed["experience"].append(line.strip())

    # Extract Skills
    parsed["skills"] = [skill for skill in SKILLS if skill.lower() in text.lower()]

    return parsed


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is running!"})

@app.route('/upload', methods=['POST'])
def upload_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    filename = secure_filename(file.filename)

    if filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(file)
    else:
        raw_text = file.read().decode("utf-8")

    parsed_data = parse_resume(raw_text)

    return jsonify({
        "raw_text": raw_text,
        "parsed_data": parsed_data
    })

if __name__ == '__main__':
    app.run(debug=True)

