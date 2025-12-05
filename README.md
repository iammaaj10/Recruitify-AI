🚀 Recruitify AI — Intelligent Resume–JD Matcher
🔍 Smart AI engine that compares your Resume with a Job Description and instantly gives:

✔️ Match Score
✔️ Matched Skills
✔️ Missing Skills
✔️ Actionable Feedback

Live Demo: https://your-vercel-link.vercel.app

⭐ Overview

Recruitify AI is an AI-powered web application that evaluates how well a candidate’s resume matches a job description. It uses NLP (Natural Language Processing) techniques such as text preprocessing, TF-IDF vectorization, cosine similarity, and rule-based skill extraction to generate a match score and provide skill-based insights.

This project is built using:

React + TypeScript (Vite) → Frontend

Flask + Python (NLP) → Backend

Render → Backend Deployment

Vercel → Frontend Hosting

✨ Features
🔹 Resume–JD Match Score

Calculates similarity using TF-IDF + cosine similarity + skill alignment logic.

🔹 Skill Extraction

Extracts technical skills from both resume & JD using a predefined skill dictionary.

🔹 Matched & Missing Skill Visualization

Clearly highlights skills you have vs. skills required for the job.

🔹 Personalized Feedback

Generates human-friendly suggestions on how to improve your resume for the JD.

🔹 Clean & Modern UI

Built with TailwindCSS and React, fully responsive.

🔹 Deployed Frontend + Backend

Frontend on Vercel, Backend on Render.

🏗️ Tech Stack
🎨 Frontend

React (TypeScript)

Vite

TailwindCSS

Fetch API

🧠 Backend

Python

Flask

scikit-learn (TF-IDF & cosine similarity)

NLTK (stopwords)

Regex skill extraction logic

☁️ Deployment

Vercel (Frontend)

Render (Backend API)

🔧 Architecture
React Frontend (Vercel)
        ↓ Sends resume & JD
Flask API (Render)
        ↓ NLP Processing
  • Preprocessing
  • TF-IDF Vectorization
  • Cosine Similarity
  • Skill Extraction
        ↓ Returns JSON
Frontend UI displays results
