import React, { useState } from "react";
import { Sparkles, Upload, Briefcase, CheckCircle, XCircle, TrendingUp, Zap } from "lucide-react";

interface MatchResponse {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  feedback: string;
}

const Dashboard: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>("");
  const [jdText, setJdText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [error, setError] = useState<string>("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeText.trim() || !jdText.trim()) {
      setError("Please fill in both resume and job description fields");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });

      if (!response.ok) {
        throw new Error("Failed to get match results");
      }

      const data: MatchResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeText("");
    setJdText("");
    setResult(null);
    setError("");
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return "border-emerald-500 text-emerald-600";
    if (score >= 40) return "border-amber-500 text-amber-600";
    return "border-rose-500 text-rose-600";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 70) return "Excellent Match";
    if (score >= 40) return "Average Match";
    return "Needs Work";
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 70) return "bg-gradient-to-br from-emerald-50 to-teal-50";
    if (score >= 40) return "bg-gradient-to-br from-amber-50 to-orange-50";
    return "bg-gradient-to-br from-rose-50 to-pink-50";
  };

  const getScoreGradient = (score: number): string => {
    if (score >= 70) return "from-emerald-500 to-teal-500";
    if (score >= 40) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-pink-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Header */}
          <header className="text-center mb-12 relative">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl p-4">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
              Recruitify AI
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Discover your perfect job match with AI-powered resume analysis
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span>Instant Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Smart Insights</span>
              </div>
            </div>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Input */}
              <div className="space-y-3 group">
                <label
                  htmlFor="resume"
                  className="flex items-center gap-2 text-lg font-bold text-gray-800"
                >
                  <div className="p-2 bg-linear-to-br from-purple-100 to-indigo-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-purple-600" />
                  </div>
                  Your Resume
                </label>
                <div className="relative">
                  <textarea
                    id="resume"
                    placeholder="✨ Paste your resume text here and watch the magic happen..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={12}
                    disabled={loading}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-y disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:border-purple-300"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium">
                    {resumeText.length} characters
                  </div>
                </div>
              </div>

              {/* Job Description Input */}
              <div className="space-y-3 group">
                <label
                  htmlFor="jd"
                  className="flex items-center gap-2 text-lg font-bold text-gray-800"
                >
                  <div className="p-2 bg-linear-to-br from-indigo-100 to-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
                  Job Description
                </label>
                <div className="relative">
                  <textarea
                    id="jd"
                    placeholder="📋 Paste the job description here to find your match..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    rows={12}
                    disabled={loading}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:border-indigo-300"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium">
                    {jdText.length} characters
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-linear-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-700 p-5 rounded-2xl shadow-lg animate-shake">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-semibold">{error}</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative px-10 py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing Your Match...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Analyze Match
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-10 py-4 bg-linear-to-r from-gray-600 to-gray-700 text-white font-bold rounded-2xl hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                🔄 Start Over
              </button>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-16 space-y-10 animate-fadeIn">
              {/* Score Section */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className={`absolute inset-0 bg-linear-to-r ${getScoreGradient(result.matchScore)} rounded-full blur-2xl opacity-30 animate-pulse`}></div>
                  <div
                    className={`relative w-56 h-56 rounded-full border-8 ${getScoreColor(
                      result.matchScore
                    )} ${getScoreBgColor(
                      result.matchScore
                    )} flex flex-col items-center justify-center shadow-2xl transform hover:scale-105 transition-transform`}
                  >
                    <span
                      className={`text-6xl font-black ${getScoreColor(
                        result.matchScore
                      )}`}
                    >
                      {result.matchScore}%
                    </span>
                    <span className="text-base font-bold text-gray-700 mt-3 px-4 py-1 bg-white/80 rounded-full">
                      {getScoreLabel(result.matchScore)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Matched Skills */}
                <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-shadow">
                  <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-emerald-200 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-emerald-700" />
                    </div>
                    Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {result.matchedSkills.length > 0 ? (
                      result.matchedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-5 py-2.5 bg-white text-emerald-800 rounded-full text-sm font-bold border-2 border-emerald-300 shadow-md hover:shadow-lg hover:scale-105 transition-all"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic font-medium">
                        No matching skills found
                      </p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-linear-to-br from-rose-50 to-pink-50 rounded-3xl p-8 border-2 border-rose-200 shadow-xl hover:shadow-2xl transition-shadow">
                  <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-rose-200 rounded-xl">
                      <XCircle className="w-6 h-6 text-rose-700" />
                    </div>
                    Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {result.missingSkills.length > 0 ? (
                      result.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-5 py-2.5 bg-white text-rose-800 rounded-full text-sm font-bold border-2 border-rose-300 shadow-md hover:shadow-lg hover:scale-105 transition-all"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-emerald-600 font-bold flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        You have all required skills!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="relative overflow-hidden bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl">
                <div className="absolute inset-0 bg-grid-white/10"></div>
                <div className="relative">
                  <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    AI Insights & Recommendations
                  </h3>
                  <p className="text-lg leading-relaxed font-medium opacity-95 bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    {result.feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;