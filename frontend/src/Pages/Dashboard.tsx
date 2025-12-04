import React, { useState } from 'react';

interface MatchResponse {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  feedback: string;
}

const Dashboard: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jdText, setJdText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeText.trim() || !jdText.trim()) {
      setError('Please fill in both resume and job description fields');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jdText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get match results');
      }

      const data: MatchResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setJdText('');
    setResult(null);
    setError('');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'border-green-500 text-green-600';
    if (score >= 40) return 'border-orange-500 text-orange-600';
    return 'border-red-500 text-red-600';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 70) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Low Match';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 70) return 'bg-green-50';
    if (score >= 40) return 'bg-orange-50';
    return 'bg-red-50';
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Recruitify AI
            </h1>
            <p className="text-lg text-gray-600">
              Analyze how well your resume matches the job description
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Input */}
            <div className="space-y-2">
              <label 
                htmlFor="resume" 
                className="block text-lg font-semibold text-gray-700"
              >
                Your Resume
              </label>
              <textarea
                id="resume"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={10}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Job Description Input */}
            <div className="space-y-2">
              <label 
                htmlFor="jd" 
                className="block text-lg font-semibold text-gray-700"
              >
                Job Description
              </label>
              <textarea
                id="jd"
                placeholder="Paste the job description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={10}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                <p className="font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  '🔍 Check Match'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                🔄 Reset
              </button>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-12 space-y-8 animate-fadeIn">
              {/* Score Section */}
              <div className="flex justify-center">
                <div className={`w-48 h-48 rounded-full border-8 ${getScoreColor(result.matchScore)} ${getScoreBgColor(result.matchScore)} flex flex-col items-center justify-center shadow-lg`}>
                  <span className={`text-5xl font-bold ${getScoreColor(result.matchScore)}`}>
                    {result.matchScore}%
                  </span>
                  <span className="text-sm text-gray-600 mt-2">
                    {getScoreLabel(result.matchScore)}
                  </span>
                </div>
              </div>

              {/* Skills Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Matched Skills */}
                <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    ✅ Matched Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedSkills.length > 0 ? (
                      result.matchedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-semibold border-2 border-green-400"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No matching skills found</p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    ❌ Missing Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.length > 0 ? (
                      result.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-red-200 text-red-800 rounded-full text-sm font-semibold border-2 border-red-400"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">You have all required skills!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  💡 Feedback & Recommendations
                </h3>
                <p className="text-lg leading-relaxed">
                  {result.feedback}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;