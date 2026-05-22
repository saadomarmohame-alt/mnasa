import { useState, useEffect } from 'react';
import { Timer, AlertCircle, Award, CheckCircle2, XCircle, ChevronRight, Activity, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { Quiz, QuizQuestion, Certificate } from '../types';

interface ActiveExamProps {
  quiz: Quiz;
  studentName: string;
  userId: string;
  onExamCompleted: (score: number, Certificate?: Certificate) => void;
}

export default function ActiveExam({ quiz, studentName, userId, onExamCompleted }: ActiveExamProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimitSeconds);
  const [isExamActive, setIsExamActive] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [gradingInProgress, setGradingInProgress] = useState(false);

  // Countdown timer logic
  useEffect(() => {
    if (!isExamActive || examFinished) return;

    if (timeRemaining <= 0) {
      handleForceSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamActive, timeRemaining, examFinished]);

  const startExam = () => {
    setIsExamActive(true);
    setTimeRemaining(quiz.timeLimitSeconds);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamFinished(false);
  };

  const handleSelectOption = (optionIndex: number) => {
    const questionId = quiz.questions[currentQuestionIndex].id;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleForceSubmit = () => {
    setExamFinished(true);
    setIsExamActive(false);
    calculateResults();
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < quiz.questions.length) {
      if (!confirm(`You have only answered ${answeredCount}/${quiz.questions.length} questions. Submit anyway?`)) {
        return;
      }
    }

    setGradingInProgress(true);
    // Simulate high-performance machine automatic grading models
    setTimeout(() => {
      setGradingInProgress(false);
      setExamFinished(true);
      setIsExamActive(false);
      calculateResults();
    }, 1800);
  };

  const calculateResults = () => {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    setFinalScore(score);

    // If passed (>70%), generate high-end Certificate details
    let cert: Certificate | undefined;
    if (score >= 70) {
      cert = {
        id: `cert-${Date.now()}`,
        userId,
        userName: studentName,
        courseId: quiz.courseId,
        courseTitle: quiz.courseTitle,
        issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        score,
        credentialId: `ARG-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}B`,
      };
    }

    onExamCompleted(score, cert);
  };

  // Convert seconds to readable MM:SS
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion: QuizQuestion = quiz.questions[currentQuestionIndex];
  const isSelected = selectedAnswers[currentQuestion?.id] !== undefined;

  return (
    <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative cyber grids */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {!isExamActive && !examFinished && (
        <div className="text-center py-8 space-y-6">
          <div className="inline-flex p-3.5 bg-cyan-950/20 text-cyan-400 rounded-full border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <Timer className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-sans font-bold text-white uppercase tracking-wide">
              Secure Certifying Exam: {quiz.courseTitle}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              This is an enterprise-level, anti-piracy secured validating exam. You must score <strong className="text-cyan-400">70% or higher</strong> to earn your dynamic digital certificate.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-center font-mono text-xs">
            <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
              <span className="block text-slate-500 text-[10px] uppercase">Questions</span>
              <span className="text-sm font-bold text-white">{quiz.questions.length}</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
              <span className="block text-slate-500 text-[10px] uppercase">Time Limit</span>
              <span className="text-sm font-bold text-cyan-400">{Math.round(quiz.timeLimitSeconds / 60)}m</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
              <span className="block text-slate-500 text-[10px] uppercase">Security Level</span>
              <span className="text-sm font-bold text-emerald-400">Proctor X</span>
            </div>
          </div>

          <button
            onClick={startExam}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-black font-sans font-bold text-xs tracking-wider uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-cyan-400/10"
          >
            Initiate Exam Decryption
          </button>
        </div>
      )}

      {gradingInProgress && (
        <div className="text-center py-16 space-y-4">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
          <h4 className="text-sm font-mono text-cyan-400">CALCULATING NEURAL WEIGHT GRADIENTS...</h4>
          <p className="text-xs text-slate-500">Neutralizing SQL logs, reverse-grading, certifying credentials serial numbers...</p>
        </div>
      )}

      {isExamActive && !gradingInProgress && (
        <div className="space-y-6">
          {/* Header tracker with timers */}
          <div className="flex items-center justify-between border-b border-slate-850 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Interactive Exam Console</span>
              <h3 className="text-sm font-sans font-bold text-slate-100 truncate max-w-[200px] md:max-w-md">
                {quiz.courseTitle}
              </h3>
            </div>

            {/* Glowing timers */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold transition-all ${timeRemaining < 60 ? 'bg-red-950/40 text-red-500 border-red-500 animate-pulse shadow-lg shadow-red-500/10' : 'bg-cyan-950/20 text-cyan-400 border-cyan-500/20'}`}>
              <Timer className="w-4 h-4" />
              <span>{formatTimer(timeRemaining)}</span>
            </div>
          </div>

          {/* Question markers circles headers */}
          <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {quiz.questions.map((_, index) => {
              const qId = quiz.questions[index].id;
              const isAnswered = selectedAnswers[qId] !== undefined;
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-7.5 h-7.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center border shrink-0 transition-all ${isCurrent ? 'bg-cyan-400 border-cyan-300 text-black shadow-md shadow-cyan-400/20' : isAnswered ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-400 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Title */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <p className="text-sm md:text-base text-slate-100 font-sans leading-relaxed font-bold">
              {currentQuestion.question}
            </p>
          </div>

          {/* Option elements list */}
          <div className="grid grid-cols-1 gap-3.5">
            {currentQuestion.options.map((option, oIdx) => {
              const isSelectedOption = selectedAnswers[currentQuestion.id] === oIdx;

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`text-left p-4 rounded-xl border font-sans text-xs md:text-sm transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${isSelectedOption ? 'bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border-cyan-400 text-white shadow-lg shadow-cyan-500/5' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 text-slate-300'}`}
                >
                  <span>{option}</span>
                  <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-all ${isSelectedOption ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'}`}>
                    {isSelectedOption && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigational controls footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-900">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 font-mono text-xs rounded-lg border transition ${currentQuestionIndex === 0 ? 'border-slate-900 text-slate-600 cursor-not-allowed' : 'border-slate-800 text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              Previous
            </button>

            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isSelected}
                className={`px-5 py-2 font-mono text-xs rounded-lg transition-all ${isSelected ? 'bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 font-semibold' : 'bg-slate-900 border border-slate-900 text-slate-600 cursor-not-allowed'}`}
              >
                Next Option
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-sans font-bold text-xs tracking-wider uppercase hover:brightness-110 shadow-lg shadow-emerald-500/10 active:scale-95 transition"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished Exam Results Screen! */}
      {examFinished && !gradingInProgress && (
        <div className="text-center py-6 space-y-6">
          <div className="flex justify-center">
            {finalScore >= 70 ? (
              <div className="inline-flex p-4 bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 rounded-full shadow-lg shadow-emerald-500/5 animate-bounce">
                <Award className="w-14 h-14" />
              </div>
            ) : (
              <div className="inline-flex p-4 bg-red-950/20 text-red-400 border border-red-500/20 rounded-full shadow-lg shadow-red-500/5">
                <XCircle className="w-14 h-14" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Grading Computation Complete</span>
            <h3 className="text-xl font-sans font-extrabold text-white">
              {finalScore >= 70 ? 'CONGRATULATIONS, YOU PASSED!' : 'EXAM NOT PASSED'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {finalScore >= 70
                ? 'Your rigorous academic profile has been confirmed. A permanent cryptographic AL ARGINTINI certification credentials ID was registered for your profile!'
                : 'Your neural validation scored below the required 70% bounds. We highly recommend reviewing notes or community forums before submitting another attempt.'}
            </p>
          </div>

          {/* stats display grids */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto p-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl">
            <div className="text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Computed Score</span>
              <p className={`text-2xl font-mono font-extrabold ${finalScore >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>{finalScore}%</p>
            </div>
            <div className="text-center border-l border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Percentile Rank</span>
              <p className="text-2xl font-mono font-extrabold text-cyan-400">Top 8%</p>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            {finalScore < 70 ? (
              <button
                onClick={startExam}
                className="px-6 py-2.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition"
              >
                Re-attempt Exam Core
              </button>
            ) : (
              <div className="space-y-1 text-center w-full">
                <p className="text-[10px] font-mono text-emerald-400 bg-emerald-950/25 border border-emerald-500/20 py-1.5 px-3 rounded-lg max-w-sm mx-auto">
                  Certificate code registered: ARG-{Math.floor(Math.random()*89+10)}-X89V
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
