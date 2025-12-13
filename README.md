🚀 Recruitify AI — Intelligent Resume–Job Description Matcher

🔍 A smart AI engine that analyzes your resume against a job description and instantly delivers actionable insights.

✔️ Match Score
✔️ Matched Skills
✔️ Missing Skills
✔️ Personalized Feedback

🌐 Live Demo: https://your-vercel-link.vercel.app
------------------------
⭐ Overview

Recruitify AI is an AI-powered web application designed to evaluate how closely a candidate’s resume aligns with a given job description. By leveraging Natural Language Processing (NLP) techniques such as text preprocessing, TF-IDF vectorization, cosine similarity, and rule-based skill extraction, the platform generates an accurate match score along with clear skill-level insights.

This tool helps candidates understand their strengths, identify skill gaps, and optimize their resumes for better job alignment.
--------------------------------------
🏗️ System Architecture
React Frontend (Vercel)
        ↓ Sends Resume & JD
Flask API (Render)
        ↓ NLP Processing
   • Text Preprocessing
   • TF-IDF Vectorization
   • Cosine Similarity
   • Skill Extraction
        ↓ JSON Response
Frontend UI Displays Results
---------------------------------------------------
✨ Key Features
🔹 Resume–JD Match Score

Calculates resume–JD similarity using TF-IDF + cosine similarity enhanced with skill alignment logic.

🔹 Skill Extraction

Identifies technical skills from both the resume and job description using a predefined skill dictionary.

🔹 Matched & Missing Skill Visualization

Clearly distinguishes between skills you possess and skills required for the job, helping users focus on improvement areas.

🔹 Personalized Feedback

Generates human-friendly recommendations to improve resume relevance and job readiness.

🔹 Clean & Modern UI

Built with React and TailwindCSS, delivering a responsive and intuitive user experience.

🔹 Full-Stack Deployment

Frontend deployed on Vercel, backend NLP API hosted on Render.
--------------------------------------------------
🛠️ Tech Stack

🎨 Frontend
React (TypeScript)
Vite
TailwindCSS
Fetch API

🧠 Backend
Python
Flask
scikit-learn (TF-IDF & cosine similarity)
NLTK (stopword removal)
Regex-based skill extraction


☁️ Deployment
Vercel — Frontend Hosting
Render — Backend API Hosting
------------------------------------------

🎯 Use Case
Recruitify AI assists:
Job seekers optimizing resumes
Freshers identifying skill gaps
Developers tailoring resumes for specific roles

By providing instant, data-driven feedback, it bridges the gap between resumes and job expectations.
