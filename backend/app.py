from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import nltk
from nltk.corpus import stopwords

app = Flask(__name__)
CORS(app)

# Ensure NLTK stopwords are available
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Load stopwords ONCE (optimization)
STOP_WORDS = set(stopwords.words('english'))

# Predefined skills list
SKILLS = [
    "react", "reactjs", "node.js", "nodejs", "express", "expressjs",
    "mongodb", "python", "flask", "django", "aws", "amazon web services",
    "docker", "mysql", "postgresql", "typescript", "javascript",
    "machine learning", "ml", "ai", "artificial intelligence",
    "java", "spring boot", "kubernetes", "git", "rest api",
    "html", "css", "angular", "vue.js", "vuejs", "redux",
    "graphql", "microservices", "ci/cd", "jenkins", "terraform",
    "azure", "gcp", "google cloud", "redis", "rabbitmq",
    "elasticsearch", "kafka", "spark", "hadoop", "pandas",
    "numpy", "tensorflow", "pytorch", "keras", "scikit-learn",
    "c++", "c#", ".net", "go", "golang", "rust", "swift",
    "kotlin", "android", "ios", "react native", "flutter"
]

def preprocess_text(text: str) -> str:
    """
    Preprocess text: lowercase, remove special chars, remove stopwords
    """
    if not text:
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove special characters and extra spaces
    text = re.sub(r'[^a-z0-9\s\.]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    
    # Remove stopwords
    words = text.split()
    filtered_words = [word for word in words if word not in STOP_WORDS]
    
    return ' '.join(filtered_words)

def extract_skills(text: str, skill_list) -> list:
    """
    Extract skills from text based on predefined skill list
    """
    text_lower = text.lower()
    found_skills = []
    
    for skill in skill_list:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            # Normalize skill names
            if skill in ["nodejs", "node.js"]:
                normalized_skill = "Node.js"
            elif skill in ["reactjs", "react"]:
                normalized_skill = "React"
            elif skill in ["expressjs", "express"]:
                normalized_skill = "Express"
            elif skill in ["vuejs", "vue.js"]:
                normalized_skill = "Vue.js"
            else:
                normalized_skill = skill.title()
            
            if normalized_skill not in found_skills:
                found_skills.append(normalized_skill)
    
    return found_skills

def calculate_text_similarity(resume_text: str, jd_text: str) -> float:
    """
    Calculate text similarity using TF-IDF and cosine similarity.
    Returns a value between 0 and 1.
    """
    resume_processed = preprocess_text(resume_text)
    jd_processed = preprocess_text(jd_text)
    
    if not resume_processed or not jd_processed:
        return 0.0

    # Slightly richer representation: unigrams + bigrams, built-in English stopwords
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([resume_processed, jd_processed])
    
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return float(similarity)

def calculate_final_match_score(text_similarity: float,
                                matched_skills: list,
                                jd_skills: list) -> float:
    """
    Combine text similarity and skill match into a final 0–100 score.
    - text_similarity: 0–1
    - skill_match_ratio: 0–1
    """
    # Skill match ratio: how many JD skills are present in the resume
    if jd_skills:
        skill_match_ratio = len(matched_skills) / len(jd_skills)
    else:
        skill_match_ratio = 0.0

    # Weighted combination
    # 70% text similarity + 30% skill overlap
    combined = 0.7 * text_similarity + 0.3 * skill_match_ratio
    return round(combined * 100, 2)

def generate_feedback(match_score: float,
                      matched_skills: list,
                      missing_skills: list) -> str:
    """
    Generate feedback based on match score and skills
    """
    feedback = ""
    
    if match_score < 40:
        feedback = "Low match. Your resume doesn't align well with the job description. "
        if missing_skills:
            feedback += "Consider adding more relevant skills, projects, and experience related to: "
            feedback += ", ".join(missing_skills[:5]) + "."
        else:
            feedback += "Try tailoring your resume more closely to the job description."
    elif match_score < 70:
        feedback = "Average match. You have some relevant skills but there's room for improvement. "
        if missing_skills:
            feedback += f"You're missing key skills like: {', '.join(missing_skills[:5])}. "
            feedback += "Consider adding projects or certifications in these areas to strengthen your profile."
        else:
            feedback += "Focus on highlighting your matching skills more prominently in your resume."
    else:
        feedback = "Good match! Your resume aligns well with the job description. "
        if matched_skills:
            feedback += f"Strong alignment in: {', '.join(matched_skills[:5])}. "
        if missing_skills:
            feedback += f"To further improve, consider learning or highlighting: {', '.join(missing_skills[:3])}."
        else:
            feedback += "Make sure to highlight these skills clearly in your resume and cover letter."
    
    return feedback

@app.route('/api/match', methods=['POST'])
def match_resume_jd():
    """
    Main API endpoint to match resume with job description
    """
    try:
        data = request.get_json() or {}
        resume_text = data.get('resumeText', '').strip()
        jd_text = data.get('jdText', '').strip()
        
        if not resume_text or not jd_text:
            return jsonify({
                'error': 'Both resume and job description are required'
            }), 400
        
        # Extract skills first
        jd_skills = extract_skills(jd_text, SKILLS)
        resume_skills = extract_skills(resume_text, SKILLS)
        matched_skills = [skill for skill in jd_skills if skill in resume_skills]
        missing_skills = [skill for skill in jd_skills if skill not in resume_skills]

        # Text similarity
        text_similarity = calculate_text_similarity(resume_text, jd_text)

        # Final combined match score (0–100)
        match_score = calculate_final_match_score(text_similarity, matched_skills, jd_skills)
        
        # Feedback
        feedback = generate_feedback(match_score, matched_skills, missing_skills)
        
        return jsonify({
            'matchScore': match_score,
            'matchedSkills': matched_skills,
            'missingSkills': missing_skills,
            'feedback': feedback,
            # optional extra info for debugging / viva:
            # 'jdSkills': jd_skills,
            # 'resumeSkills': resume_skills,
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({'status': 'healthy'}), 200

@app.route('/', methods=['GET'])
def home():
    """
    Simple root endpoint for quick check
    """
    return jsonify({
        'message': 'AI Resume-JD Matcher Backend is running',
        'endpoints': ['/api/health', '/api/match']
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
