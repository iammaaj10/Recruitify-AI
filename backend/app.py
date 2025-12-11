import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import nltk
from nltk.corpus import stopwords
from collections import Counter

app = Flask(__name__)
CORS(app)

# Ensure NLTK stopwords are available
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

STOP_WORDS = set(stopwords.words('english'))

# Enhanced and categorized skills list
SKILLS = {
    # Frontend
    "react", "reactjs", "react.js", "vue", "vue.js", "vuejs", "angular", "angularjs",
    "svelte", "next.js", "nextjs", "nuxt", "gatsby", "html", "html5", "css", "css3",
    "sass", "scss", "less", "tailwind", "tailwindcss", "bootstrap", "material-ui",
    "mui", "chakra ui", "styled-components", "webpack", "vite", "redux", "mobx",
    "recoil", "zustand", "jquery", "ember", "backbone",
    
    # Backend
    "node.js", "nodejs", "express", "expressjs", "nestjs", "fastify", "koa",
    "python", "flask", "django", "fastapi", "tornado", "pyramid",
    "java", "spring", "spring boot", "hibernate", "jakarta ee",
    "php", "laravel", "symfony", "codeigniter", "ruby", "ruby on rails", "rails",
    "go", "golang", "gin", "echo", "c#", "csharp", ".net", "asp.net", ".net core",
    "rust", "actix", "rocket", "scala", "play framework", "kotlin", "ktor",
    
    # Databases
    "mysql", "postgresql", "postgres", "mongodb", "mongo", "redis", "cassandra",
    "dynamodb", "mariadb", "sqlite", "oracle", "sql server", "mssql", "couchdb",
    "neo4j", "influxdb", "timescaledb", "elasticsearch", "elastic",
    
    # Cloud & DevOps
    "aws", "amazon web services", "ec2", "s3", "lambda", "rds", "dynamodb",
    "azure", "microsoft azure", "gcp", "google cloud", "google cloud platform",
    "docker", "kubernetes", "k8s", "helm", "jenkins", "gitlab ci", "github actions",
    "circleci", "travis ci", "terraform", "ansible", "puppet", "chef", "vagrant",
    "prometheus", "grafana", "datadog", "new relic", "splunk", "cloudformation",
    "nginx", "apache", "caddy", "istio", "consul", "vault",
    
    # Machine Learning & AI
    "machine learning", "ml", "deep learning", "artificial intelligence", "ai",
    "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn", "pandas", "numpy",
    "scipy", "matplotlib", "seaborn", "opencv", "nltk", "spacy", "hugging face",
    "transformers", "bert", "gpt", "llm", "neural networks", "cnn", "rnn", "lstm",
    "xgboost", "lightgbm", "catboost", "jupyter", "google colab",
    
    # Mobile
    "android", "ios", "swift", "swiftui", "objective-c", "kotlin",
    "react native", "flutter", "dart", "ionic", "xamarin", "cordova",
    
    # Other Technologies
    "git", "github", "gitlab", "bitbucket", "svn", "mercurial",
    "rest api", "restful", "graphql", "grpc", "soap", "websocket",
    "microservices", "serverless", "lambda functions", "api gateway",
    "rabbitmq", "kafka", "activemq", "pulsar", "nats",
    "spark", "hadoop", "hive", "pig", "flink", "storm",
    "ci/cd", "agile", "scrum", "kanban", "jira", "confluence",
    "unit testing", "integration testing", "jest", "mocha", "chai", "pytest",
    "junit", "testng", "selenium", "cypress", "playwright", "puppeteer",
    "oauth", "jwt", "saml", "ldap", "active directory",
    "typescript", "javascript", "c++", "c", "perl", "bash", "powershell",
    "linux", "unix", "windows server", "ubuntu", "centos", "debian"
}

# Experience level indicators
EXPERIENCE_KEYWORDS = {
    "senior": ["senior", "lead", "principal", "staff", "architect", "head of", "chief", "director"],
    "mid": ["mid-level", "intermediate", "experienced", "3+ years", "4+ years", "5+ years"],
    "junior": ["junior", "entry-level", "graduate", "fresher", "0-2 years", "associate"]
}

# Education keywords
EDUCATION_KEYWORDS = {
    "bachelor", "bs", "ba", "btech", "be", "bsc",
    "master", "ms", "ma", "mtech", "msc", "mba",
    "phd", "doctorate", "postgraduate"
}

def preprocess_text(text: str) -> str:
    """Enhanced preprocessing with better tokenization"""
    if not text:
        return ""
    
    text = text.lower()
    # Preserve dots in version numbers and domains
    text = re.sub(r'[^a-z0-9\s\.\+\#]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    
    words = text.split()
    filtered_words = [word for word in words if word not in STOP_WORDS and len(word) > 1]
    
    return ' '.join(filtered_words)

def extract_skills(text: str) -> list:
    """Enhanced skill extraction with better pattern matching"""
    text_lower = text.lower()
    found_skills = set()
    
    for skill in SKILLS:
        # Create pattern that matches whole words or common variations
        patterns = [
            r'\b' + re.escape(skill) + r'\b',
            r'\b' + re.escape(skill.replace('.', '')) + r'\b',
            r'\b' + re.escape(skill.replace(' ', '-')) + r'\b',
            r'\b' + re.escape(skill.replace(' ', '')) + r'\b'
        ]
        
        for pattern in patterns:
            if re.search(pattern, text_lower):
                normalized_skill = normalize_skill_name(skill)
                found_skills.add(normalized_skill)
                break
    
    return sorted(list(found_skills))

def normalize_skill_name(skill: str) -> str:
    """Normalize skill names to standard format"""
    skill_map = {
        "nodejs": "Node.js", "node.js": "Node.js",
        "reactjs": "React", "react.js": "React", "react": "React",
        "expressjs": "Express", "express": "Express",
        "vuejs": "Vue.js", "vue.js": "Vue.js", "vue": "Vue.js",
        "angularjs": "Angular", "angular": "Angular",
        "mongodb": "MongoDB", "mongo": "MongoDB",
        "postgresql": "PostgreSQL", "postgres": "PostgreSQL",
        "mysql": "MySQL",
        "javascript": "JavaScript",
        "typescript": "TypeScript",
        "python": "Python",
        "java": "Java",
        "aws": "AWS", "amazon web services": "AWS",
        "gcp": "Google Cloud", "google cloud": "Google Cloud",
        "azure": "Azure", "microsoft azure": "Azure",
        "docker": "Docker",
        "kubernetes": "Kubernetes", "k8s": "Kubernetes",
        "machine learning": "Machine Learning", "ml": "Machine Learning",
        "artificial intelligence": "AI", "ai": "AI",
        "c++": "C++", "csharp": "C#", "c#": "C#",
        "golang": "Go", "go": "Go",
        ".net": ".NET", "asp.net": "ASP.NET",
        "rest api": "REST API", "restful": "REST API",
        "graphql": "GraphQL",
        "ci/cd": "CI/CD"
    }
    
    normalized = skill_map.get(skill.lower(), skill.title())
    return normalized

def extract_experience_level(text: str) -> str:
    """Extract experience level from text"""
    text_lower = text.lower()
    
    for level, keywords in EXPERIENCE_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                return level
    
    # Try to extract years of experience
    years_match = re.search(r'(\d+)\+?\s*years?', text_lower)
    if years_match:
        years = int(years_match.group(1))
        if years >= 5:
            return "senior"
        elif years >= 2:
            return "mid"
        else:
            return "junior"
    
    return "unknown"

def extract_education(text: str) -> list:
    """Extract education qualifications"""
    text_lower = text.lower()
    found_education = []
    
    for edu in EDUCATION_KEYWORDS:
        pattern = r'\b' + re.escape(edu) + r'\b'
        if re.search(pattern, text_lower):
            found_education.append(edu.upper())
    
    return list(set(found_education))

def calculate_text_similarity(resume_text: str, jd_text: str) -> float:
    """Enhanced similarity calculation"""
    resume_processed = preprocess_text(resume_text)
    jd_processed = preprocess_text(jd_text)
    
    if not resume_processed or not jd_processed:
        return 0.0

    # Use trigrams for better context matching
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 3),
        stop_words='english',
        max_features=1000,
        min_df=1
    )
    
    try:
        tfidf_matrix = vectorizer.fit_transform([resume_processed, jd_processed])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(similarity)
    except:
        return 0.0

def calculate_skill_coverage(matched_skills: list, jd_skills: list) -> dict:
    """Calculate detailed skill coverage metrics"""
    if not jd_skills:
        return {"ratio": 0.0, "critical_missing": []}
    
    coverage_ratio = len(matched_skills) / len(jd_skills)
    
    # Identify critical missing skills (top required skills)
    critical_missing = [skill for skill in jd_skills[:10] if skill not in matched_skills]
    
    return {
        "ratio": coverage_ratio,
        "critical_missing": critical_missing
    }

def calculate_final_match_score(text_similarity: float,
                                skill_coverage: dict,
                                experience_match: bool,
                                education_match: bool) -> float:
    """Enhanced scoring with multiple factors"""
    weights = {
        "text_similarity": 0.40,
        "skill_coverage": 0.35,
        "experience": 0.15,
        "education": 0.10
    }
    
    skill_score = skill_coverage["ratio"]
    experience_score = 1.0 if experience_match else 0.5
    education_score = 1.0 if education_match else 0.6
    
    combined = (
        weights["text_similarity"] * text_similarity +
        weights["skill_coverage"] * skill_score +
        weights["experience"] * experience_score +
        weights["education"] * education_score
    )
    
    # Boost score if critical skills are present
    if skill_coverage["ratio"] > 0.8:
        combined *= 1.05
    
    # Cap at 100
    return min(round(combined * 100, 2), 100.0)

def generate_feedback(match_score: float,
                      matched_skills: list,
                      missing_skills: list,
                      skill_coverage: dict) -> str:
    """Enhanced feedback generation"""
    feedback_parts = []
    
    if match_score >= 80:
        feedback_parts.append("🎉 Excellent match! Your resume strongly aligns with this job description.")
        if matched_skills:
            feedback_parts.append(f"You demonstrate proficiency in key areas: {', '.join(matched_skills[:5])}.")
    elif match_score >= 60:
        feedback_parts.append("✅ Good match! Your profile shows relevant experience for this role.")
        if matched_skills:
            feedback_parts.append(f"Strong skills in: {', '.join(matched_skills[:4])}.")
    elif match_score >= 40:
        feedback_parts.append("⚠️ Moderate match. You have some relevant qualifications but gaps exist.")
    else:
        feedback_parts.append("❌ Low match. Significant gaps between your resume and job requirements.")
    
    # Critical missing skills
    if skill_coverage.get("critical_missing"):
        critical = skill_coverage["critical_missing"][:3]
        feedback_parts.append(f"Priority skills to acquire: {', '.join(critical)}.")
    
    # General improvement tips
    if missing_skills and match_score < 80:
        if len(missing_skills) > 5:
            feedback_parts.append(f"Consider developing skills in: {', '.join(missing_skills[:5])}, among others.")
        else:
            feedback_parts.append(f"Adding experience with {', '.join(missing_skills)} would strengthen your application.")
    
    # Encouragement
    if match_score >= 60:
        feedback_parts.append("Make sure to highlight your matching skills prominently in your application.")
    elif match_score >= 40:
        feedback_parts.append("Focus on gaining hands-on experience with the missing skills through projects or certifications.")
    else:
        feedback_parts.append("Consider building foundational skills through online courses, bootcamps, or personal projects.")
    
    return " ".join(feedback_parts)

@app.route('/api/match', methods=['POST'])
def match_resume_jd():
    """Enhanced matching endpoint"""
    try:
        data = request.get_json() or {}
        resume_text = data.get('resumeText', '').strip()
        jd_text = data.get('jdText', '').strip()
        
        if not resume_text or not jd_text:
            return jsonify({
                'error': 'Both resume and job description are required'
            }), 400
        
        # Extract all features
        jd_skills = extract_skills(jd_text)
        resume_skills = extract_skills(resume_text)
        matched_skills = [skill for skill in jd_skills if skill in resume_skills]
        missing_skills = [skill for skill in jd_skills if skill not in resume_skills]
        
        # Experience and education matching
        jd_experience = extract_experience_level(jd_text)
        resume_experience = extract_experience_level(resume_text)
        experience_match = (jd_experience == "unknown" or 
                          resume_experience == "unknown" or 
                          jd_experience == resume_experience)
        
        jd_education = extract_education(jd_text)
        resume_education = extract_education(resume_text)
        education_match = (not jd_education or 
                         any(edu in resume_education for edu in jd_education))
        
        # Calculate similarities
        text_similarity = calculate_text_similarity(resume_text, jd_text)
        skill_coverage = calculate_skill_coverage(matched_skills, jd_skills)
        
        # Final score
        match_score = calculate_final_match_score(
            text_similarity,
            skill_coverage,
            experience_match,
            education_match
        )
        
        # Generate feedback
        feedback = generate_feedback(match_score, matched_skills, missing_skills, skill_coverage)
        
        return jsonify({
            'matchScore': match_score,
            'matchedSkills': matched_skills,
            'missingSkills': missing_skills,
            'feedback': feedback,
            'details': {
                'textSimilarity': round(text_similarity * 100, 2),
                'skillCoverage': round(skill_coverage["ratio"] * 100, 2),
                'totalJdSkills': len(jd_skills),
                'totalMatchedSkills': len(matched_skills)
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'Enhanced AI Resume-JD Matcher Backend',
        'version': '2.0',
        'endpoints': ['/api/health', '/api/match']
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)