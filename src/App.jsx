import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, Eye, Flag, 
  HelpCircle, Lock, Maximize2, RotateCcw, ShieldAlert, 
  Upload, X, ChevronRight, ChevronLeft, Award, FileText, Check, Play
} from 'lucide-react';
import katex from 'katex';

// -------------------------------------------------------------
// 1. Math/LaTeX Renderer Component (KaTeX)
// -------------------------------------------------------------
function MathText({ text, className = "" }) {
  if (!text) return null;

  // Split by $$...$$ (display math) and $...$ (inline math)
  const parts = [];
  const regex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push({ type: 'text', content: text.substring(lastIdx, match.index) });
    }
    const raw = match[0];
    const isDisplay = raw.startsWith('$$');
    const mathContent = isDisplay ? raw.slice(2, -2) : raw.slice(1, -1);
    parts.push({ type: 'math', content: mathContent, display: isDisplay });
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIdx) });
  }

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return <span key={i}>{part.content}</span>;
        }
        try {
          const html = katex.renderToString(part.content, {
            displayMode: part.display,
            throwOnError: false
          });
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch {
          return <span key={i} className="font-mono text-blue-700">{part.content}</span>;
        }
      })}
    </span>
  );
}

// -------------------------------------------------------------
// 2. Default Authentic JEE Main Practice Questions
// -------------------------------------------------------------
const DEFAULT_QUESTIONS = [
  // Physics - Section A (MCQs)
  {
    id: 1,
    subject: 'Physics',
    section: 'A',
    qNum: 1,
    text: "A projectile is launched from ground level with speed $u$ at an angle $\\theta$ to the horizontal. If the radius of curvature of its trajectory at the highest point is $R$, then what is the initial projection velocity $u$?",
    options: [
      { id: '1', text: "$\\sqrt{gR} \\sec \\theta$" },
      { id: '2', text: "$\\sqrt{gR} \\cos \\theta$" },
      { id: '3', text: "$\\sqrt{2gR} \\tan \\theta$" },
      { id: '4', text: "$\\frac{gR}{\\cos \\theta}$" }
    ],
    correctAnswer: '1',
    explanation: "At the highest point, velocity is purely horizontal: $v = u \\cos \\theta$. Normal acceleration is $a_n = g$. Using $R = \\frac{v^2}{a_n} = \\frac{u^2 \\cos^2 \\theta}{g} \\implies u = \\sqrt{gR} \\sec \\theta$."
  },
  {
    id: 2,
    subject: 'Physics',
    section: 'A',
    qNum: 2,
    text: "A parallel plate capacitor having capacitance $C_0$ is filled with two dielectric slabs of dielectric constants $K_1 = 3$ and $K_2 = 6$, each of thickness $d/2$ where $d$ is plate separation. The equivalent capacitance is:",
    options: [
      { id: '1', text: "$4 C_0$" },
      { id: '2', text: "$2 C_0$" },
      { id: '3', text: "$4.5 C_0$" },
      { id: '4', text: "$9 C_0$" }
    ],
    correctAnswer: '1',
    explanation: "Two slabs in series: $C_1 = \\frac{K_1 \\epsilon_0 A}{d/2} = 2K_1 C_0 = 6 C_0$, $C_2 = 2K_2 C_0 = 12 C_0$. Equivalent $C = \\frac{C_1 C_2}{C_1 + C_2} = \\frac{6 \\times 12}{18} C_0 = 4 C_0$."
  },
  // Physics - Section B (Numerical)
  {
    id: 3,
    subject: 'Physics',
    section: 'B',
    qNum: 21,
    text: "A body of mass $2\\text{ kg}$ starts from rest under a constant force. If it acquires a velocity of $10\\text{ m/s}$ in $4\\text{ s}$, the work done by the force in Joules is:",
    options: [],
    correctAnswer: '100',
    explanation: "Using Work-Energy Theorem: $W = \\Delta K = \\frac{1}{2} m v^2 - 0 = \\frac{1}{2} (2) (10)^2 = 100\\text{ J}$."
  },
  // Chemistry - Section A (MCQs)
  {
    id: 4,
    subject: 'Chemistry',
    section: 'A',
    qNum: 1,
    text: "The magnetic moment of $[\\text{Fe}(\\text{H}_2\\text{O})_6]^{2+}$ is approximately:",
    options: [
      { id: '1', text: "$4.9\\text{ BM}$" },
      { id: '2', text: "$5.9\\text{ BM}$" },
      { id: '3', text: "$0\\text{ BM}$" },
      { id: '4', text: "$2.8\\text{ BM}$" }
    ],
    correctAnswer: '1',
    explanation: "$\\text{Fe}^{2+}$ is $3d^6$. With $\\text{H}_2\\text{O}$ as a weak field ligand, it has 4 unpaired electrons. $\\mu = \\sqrt{4(4+2)} = \\sqrt{24} \\approx 4.90\\text{ BM}$."
  },
  {
    id: 5,
    subject: 'Chemistry',
    section: 'B',
    qNum: 21,
    text: "For a first order reaction $A \\rightarrow B$, the half life is $20\\text{ minutes}$. The time required (in minutes) for $75\\%$ completion of the reaction is:",
    options: [],
    correctAnswer: '40',
    explanation: "For first order kinetics, $t_{75\\%} = 2 \\times t_{1/2} = 2 \\times 20 = 40\\text{ minutes}$."
  },
  // Mathematics - Section A (MCQs)
  {
    id: 6,
    subject: 'Mathematics',
    section: 'A',
    qNum: 1,
    text: "Evaluate the definite integral: $I = \\int_{-\\pi/2}^{\\pi/2} \\frac{\\cos x}{1 + e^x} dx$.",
    options: [
      { id: '1', text: "$1$" },
      { id: '2', text: "$2$" },
      { id: '3', text: "$\\pi$" },
      { id: '4', text: "$0$" }
    ],
    correctAnswer: '1',
    explanation: "Using $\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx$, adding both gives $2I = \\int_{-\\pi/2}^{\\pi/2} \\cos x dx = 2 \\implies I = 1$."
  },
  {
    id: 7,
    subject: 'Mathematics',
    section: 'B',
    qNum: 21,
    text: "If the system of equations $x + y + z = 6$, $x + 2y + 3z = 10$, and $x + 2y + \\lambda z = \\mu$ has infinite solutions, find the value of $\\lambda + \\mu$.",
    options: [],
    correctAnswer: '13',
    explanation: "For infinite solutions, the determinant of coefficients is $0 \\implies \\lambda = 3$. Eliminating variables gives $\\mu = 10$. Hence $\\lambda + \\mu = 3 + 10 = 13$."
  }
];

// Status Constants matching official NTA rules:
// 0: Not Visited (Gray)
// 1: Not Answered (Red/Orange)
// 2: Answered (Green)
// 3: Marked for Review (Purple)
// 4: Answered & Marked for Review (Purple with small green circle - Evaluated)
const STATUS_STYLES = {
  0: { label: 'Not Visited', bg: 'bg-[#e0e0e0] text-gray-700 border-[#c4c4c4]', badge: 'bg-gray-200' },
  1: { label: 'Not Answered', bg: 'bg-[#e74c3c] text-white border-[#c0392b]', badge: 'bg-red-500 text-white' },
  2: { label: 'Answered', bg: 'bg-[#27ae60] text-white border-[#1e8449]', badge: 'bg-green-600 text-white' },
  3: { label: 'Marked for Review', bg: 'bg-[#8e44ad] text-white border-[#6c3483]', badge: 'bg-purple-600 text-white' },
  4: { label: 'Answered & Marked for Review', bg: 'bg-[#8e44ad] text-white relative border-[#6c3483]', badge: 'bg-purple-700 text-white' }
};

export default function App() {
  // App views: 'setup' | 'exam' | 'result'
  const [view, setView] = useState('setup');
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState('');

  // Exam State
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [selectedSection, setSelectedSection] = useState('A');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 3 Hours (180 mins)
  const [strikes, setStrikes] = useState(0);
  const [strikeModal, setStrikeModal] = useState(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);

  // Audio tone generator for security strikes
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(660, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  // -------------------------------------------------------------
  // Anti Alt+Tab & Strict Fullscreen Enforcement
  // -------------------------------------------------------------
  useEffect(() => {
    if (view !== 'exam') return;

    const triggerStrike = (reason) => {
      playAlertSound();
      setStrikes(prev => {
        const next = prev + 1;
        setStrikeModal(true);
        if (next >= 3) {
          // Automatic force submit on 3rd violation
          alert("Maximum security strikes reached (3/3). Auto-submitting your test.");
          finishExam();
        }
        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerStrike("Tab switch detected");
      }
    };

    const handleWindowBlur = () => {
      triggerStrike("Window focus lost (Alt+Tab / App switch)");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        triggerStrike("Fullscreen mode exited");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [view]);

  // Exam Countdown Timer
  useEffect(() => {
    if (view !== 'exam') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view]);

  const formatTimer = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Filter questions for active subject & section
  const filteredQuestions = questions.filter(
    q => q.subject === selectedSubject && q.section === selectedSection
  );
  const currentQ = filteredQuestions[currentIdx] || filteredQuestions[0];

  // Initialize status as Not Visited (0)
  const getQStatus = (qId) => {
    return questionStatus[qId] !== undefined ? questionStatus[qId] : 0;
  };

  // Enter Fullscreen and start test
  const startExam = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen not permitted by user gesture or device
    }
    const initialStatus = {};
    questions.forEach(q => { initialStatus[q.id] = 0; });
    // First question becomes 'Not Answered' (visited)
    if (questions[0]) initialStatus[questions[0].id] = 1;
    setQuestionStatus(initialStatus);
    setStrikes(0);
    setTimeLeft(180 * 60);
    setView('exam');
  };

  const finishExam = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    setView('result');
  };

  // -------------------------------------------------------------
  // NTA Navigation & Action Handlers
  // -------------------------------------------------------------
  const handleSaveAndNext = () => {
    if (!currentQ) return;
    const hasAnswer = userAnswers[currentQ.id] !== undefined && userAnswers[currentQ.id] !== '';
    setQuestionStatus(prev => ({
      ...prev,
      [currentQ.id]: hasAnswer ? 2 : 1
    }));
    navigateNext();
  };

  const handleSaveAndMarkForReview = () => {
    if (!currentQ) return;
    const hasAnswer = userAnswers[currentQ.id] !== undefined && userAnswers[currentQ.id] !== '';
    setQuestionStatus(prev => ({
      ...prev,
      [currentQ.id]: hasAnswer ? 4 : 3
    }));
    navigateNext();
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQ) return;
    setQuestionStatus(prev => ({
      ...prev,
      [currentQ.id]: 3
    }));
    navigateNext();
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setUserAnswers(prev => {
      const updated = { ...prev };
      delete updated[currentQ.id];
      return updated;
    });
    setQuestionStatus(prev => ({
      ...prev,
      [currentQ.id]: 1 // Becomes 'Not Answered'
    }));
  };

  const navigateNext = () => {
    if (currentIdx < filteredQuestions.length - 1) {
      const nextQ = filteredQuestions[currentIdx + 1];
      if (getQStatus(nextQ.id) === 0) {
        setQuestionStatus(prev => ({ ...prev, [nextQ.id]: 1 }));
      }
      setCurrentIdx(currentIdx + 1);
    }
  };

  const jumpToQuestion = (index) => {
    const targetQ = filteredQuestions[index];
    if (targetQ && getQStatus(targetQ.id) === 0) {
      setQuestionStatus(prev => ({ ...prev, [targetQ.id]: 1 }));
    }
    setCurrentIdx(index);
  };

  // Virtual Numeric Keypad input for Section B
  const handleKeypadPress = (val) => {
    if (!currentQ) return;
    const current = String(userAnswers[currentQ.id] || '');
    if (val === 'BACKSPACE') {
      setUserAnswers(prev => ({ ...prev, [currentQ.id]: current.slice(0, -1) }));
    } else if (val === 'CLEAR') {
      setUserAnswers(prev => ({ ...prev, [currentQ.id]: '' }));
    } else {
      if (val === '.' && current.includes('.')) return;
      if (val === '-' && current.length > 0) return;
      if (current.length < 10) {
        setUserAnswers(prev => ({ ...prev, [currentQ.id]: current + val }));
      }
    }
  };

  // -------------------------------------------------------------
  // PDF Upload + Vision AI Parser Handler
  // -------------------------------------------------------------
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!apiKey.trim()) {
      alert("Please enter a free Google Gemini API key to parse uploaded PDF files.");
      return;
    }
    localStorage.setItem('GEMINI_API_KEY', apiKey.trim());

    setIsParsing(true);
    setParseStatus("Reading PDF document...");

    try {
      const pdfjsLib = await import('pdfjs-dist/build/pdf');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setParseStatus(`PDF loaded (${pdf.numPages} pages). Rendering page 1 for extraction...`);

      // Render first 2 pages for demonstration / parsing
      const pagesToProcess = Math.min(pdf.numPages, 3);
      const pageImages = [];

      for (let p = 1; p <= pagesToProcess; p++) {
        setParseStatus(`Rendering page ${p} of ${pagesToProcess}...`);
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
        pageImages.push(base64);
      }

      setParseStatus("Sending pages to Gemini Multimodal Vision API...");

      const promptText = `
        Analyze these JEE Main question paper pages. Extract all questions in structured JSON format.
        Return ONLY valid JSON matching this schema:
        [
          {
            "id": 1,
            "subject": "Physics" | "Chemistry" | "Mathematics",
            "section": "A" (for 4-choice MCQs) or "B" (for integer/numerical value questions),
            "qNum": 1,
            "text": "Question text with LaTeX enclosed in $...$ for inline or $$...$$ for display math",
            "options": [
              { "id": "1", "text": "Option 1 with $LaTeX$" },
              { "id": "2", "text": "Option 2 with $LaTeX$" },
              { "id": "3", "text": "Option 3 with $LaTeX$" },
              { "id": "4", "text": "Option 4 with $LaTeX$" }
            ],
            "correctAnswer": "1" (or the numeric value for Section B),
            "explanation": "Brief solution summary"
          }
        ]
      `;

      const contents = [
        {
          role: "user",
          parts: [
            { text: promptText },
            ...pageImages.map(b64 => ({
              inlineData: { mimeType: "image/jpeg", data: b64 }
            }))
          ]
        }
      ];

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const data = await res.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const rawJson = data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          setParseStatus(`Successfully extracted ${parsed.length} questions from the PDF!`);
        } else {
          throw new Error("No structured questions identified in document.");
        }
      } else {
        throw new Error(data.error?.message || "Failed to parse questions.");
      }
    } catch (err) {
      alert("Error parsing PDF: " + err.message);
      setParseStatus("Parsing failed. You can still practice with the authentic built-in shift paper!");
    } finally {
      setIsParsing(false);
    }
  };

  // -------------------------------------------------------------
  // Calculate Results & Scoring (+4 / -1)
  // -------------------------------------------------------------
  const calculateResults = () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const subjectBreakdown = {
      Physics: { score: 0, correct: 0, incorrect: 0, unattempted: 0 },
      Chemistry: { score: 0, correct: 0, incorrect: 0, unattempted: 0 },
      Mathematics: { score: 0, correct: 0, incorrect: 0, unattempted: 0 }
    };

    questions.forEach(q => {
      const userAns = userAnswers[q.id];
      const isAnswered = userAns !== undefined && userAns !== '';
      const sub = subjectBreakdown[q.subject] || subjectBreakdown.Physics;

      if (!isAnswered) {
        unattempted++;
        sub.unattempted++;
      } else if (String(userAns).trim() === String(q.correctAnswer).trim()) {
        score += 4;
        correct++;
        sub.score += 4;
        sub.correct++;
      } else {
        score -= 1;
        incorrect++;
        sub.score -= 1;
        sub.incorrect++;
      }
    });

    return { score, correct, incorrect, unattempted, subjectBreakdown };
  };

  // Palette counts for the question status drawer
  const getCounts = () => {
    let notVisited = 0, notAnswered = 0, answered = 0, review = 0, ansReview = 0;
    questions.forEach(q => {
      const s = getQStatus(q.id);
      if (s === 0) notVisited++;
      else if (s === 1) notAnswered++;
      else if (s === 2) answered++;
      else if (s === 3) review++;
      else if (s === 4) ansReview++;
    });
    return { notVisited, notAnswered, answered, review, ansReview };
  };

  const counts = getCounts();

  // =============================================================
  // SCREEN 1: PRE-FLIGHT & SETUP
  // =============================================================
  if (view === 'setup') {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <header className="bg-[#1b3a6b] text-white p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-[#1b3a6b] font-black px-3 py-1 rounded text-xl tracking-wider">NTA</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">JEE (Main) Computer Based Test (CBT) Simulator</h1>
              <p className="text-xs text-blue-200">National Testing Agency Replica & Past Paper Practice Environment</p>
            </div>
          </div>
          <span className="text-xs bg-blue-900 border border-blue-400 px-3 py-1 rounded-full font-medium">Strict Exam Mode</span>
        </header>

        <main className="max-w-4xl mx-auto w-full p-6 flex-1 flex flex-col justify-center">
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 border-b pb-2">Start Exam or Import Official Shift PDF</h2>
              <p className="text-sm text-slate-600 mt-2">
                You can practice right away using the pre-loaded authentic JEE Main mock questions, or upload any official NTA shift PDF to extract questions with Gemini Vision AI.
              </p>
            </div>

            {/* Shift PDF Upload Box */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50/50 flex flex-col items-center text-center">
              <Upload className="w-10 h-10 text-blue-600 mb-2" />
              <h3 className="font-semibold text-slate-800 text-sm">Upload NTA Shift Paper (PDF)</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
                Extracts questions, formulas in LaTeX, and Section A/B formatting automatically.
              </p>
              
              <div className="w-full max-w-md space-y-3">
                <input 
                  type="password"
                  placeholder="Optional: Enter Gemini API Key (stored in local browser only)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handlePdfUpload}
                  disabled={isParsing}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
              </div>

              {isParsing && (
                <div className="mt-4 flex items-center space-x-2 text-blue-700 text-xs font-medium animate-pulse">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>{parseStatus}</span>
                </div>
              )}
            </div>

            {/* Test Rules & Instructions */}
            <div className="bg-amber-50 border border-amber-200 rounded p-4 text-xs text-amber-900 space-y-2">
              <h4 className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                Anti-Distraction & Window Switching Notice:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Exam runs in <strong>True Fullscreen</strong>. Exiting fullscreen triggers a violation.</li>
                <li><strong>Alt + Tab</strong> or switching browser tabs is strictly monitored (maximum 3 strikes allowed before automatic test submission).</li>
                <li>Marking Scheme: <strong>+4</strong> for correct response, <strong>-1</strong> for incorrect response, <strong>0</strong> for unattempted.</li>
                <li>Section B requires entering numeric values using the virtual on-screen keypad.</li>
              </ul>
            </div>

            {/* Launch Exam Button */}
            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-slate-500">
                Loaded Questions: <strong>{questions.length}</strong> (Physics, Chemistry, Math)
              </div>
              <button 
                onClick={startExam}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded shadow flex items-center space-x-2 transition"
              >
                <span>Enter Strict Exam Mode</span>
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =============================================================
  // SCREEN 3: RESULT & SCORECARD
  // =============================================================
  if (view === 'result') {
    const results = calculateResults();

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <header className="bg-[#1b3a6b] text-white p-4 shadow">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="font-bold text-lg">Exam Performance & Scorecard</h1>
            <button 
              onClick={() => setView('setup')}
              className="bg-white text-blue-900 text-xs font-bold px-3 py-1.5 rounded hover:bg-blue-50 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Back to Setup
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto w-full p-6 space-y-6">
          {/* Main Score Banner */}
          <div className="bg-white p-6 rounded-lg shadow border flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Score</span>
              <div className="text-4xl font-extrabold text-[#1b3a6b] mt-1">
                {results.score} <span className="text-xl font-normal text-slate-500">/ {questions.length * 4}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Standard NTA Scoring (+4 for correct, -1 for wrong)</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded">
                <div className="text-xl font-bold text-emerald-700">{results.correct}</div>
                <div className="text-[11px] font-semibold text-emerald-800">Correct (+{results.correct * 4})</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded">
                <div className="text-xl font-bold text-rose-700">{results.incorrect}</div>
                <div className="text-[11px] font-semibold text-rose-800">Wrong (-{results.incorrect})</div>
              </div>
              <div className="bg-slate-100 border border-slate-200 px-4 py-2 rounded">
                <div className="text-xl font-bold text-slate-700">{results.unattempted}</div>
                <div className="text-[11px] font-semibold text-slate-600">Unattempted</div>
              </div>
            </div>
          </div>

          {/* Subject-Wise Breakdown Table */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-4 bg-slate-50 border-b font-bold text-sm text-slate-700">Subject-Wise Breakdown</div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 border-b text-slate-600 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Correct</th>
                  <th className="p-3">Incorrect</th>
                  <th className="p-3">Unattempted</th>
                  <th className="p-3 text-right">Subject Score</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {Object.entries(results.subjectBreakdown).map(([sub, data]) => (
                  <tr key={sub} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold">{sub}</td>
                    <td className="p-3 text-emerald-600 font-bold">{data.correct}</td>
                    <td className="p-3 text-rose-600 font-bold">{data.incorrect}</td>
                    <td className="p-3 text-slate-500">{data.unattempted}</td>
                    <td className="p-3 text-right font-bold text-blue-900">{data.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Question-wise Analysis & Explanations</h3>
            {questions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns !== undefined && String(userAns).trim() === String(q.correctAnswer).trim();
              const isUnattempted = userAns === undefined || userAns === '';

              return (
                <div key={q.id} className="bg-white p-5 rounded-lg border shadow-sm space-y-3">
                  <div className="flex justify-between items-start text-xs border-b pb-2">
                    <span className="font-bold text-slate-700">
                      Q{idx + 1}. {q.subject} (Section {q.section})
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' :
                      isUnattempted ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? 'Correct (+4)' : isUnattempted ? 'Not Attempted (0)' : 'Incorrect (-1)'}
                    </span>
                  </div>

                  <div className="text-sm text-slate-900">
                    <MathText text={q.text} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded">
                    <div>
                      <span className="text-slate-500">Your Response: </span>
                      <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-600'}>
                        {isUnattempted ? 'None' : (
                          q.section === 'A' ? `Option ${userAns}` : userAns
                        )}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Official Correct Answer: </span>
                      <strong className="text-emerald-800">
                        {q.section === 'A' ? `Option ${q.correctAnswer}` : q.correctAnswer}
                      </strong>
                    </div>
                  </div>

                  {q.explanation && (
                    <div className="text-xs text-slate-600 bg-blue-50/70 p-3 rounded border border-blue-100">
                      <strong className="text-blue-900 block mb-1">Explanation:</strong>
                      <MathText text={q.explanation} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // =============================================================
  // SCREEN 2: PIXEL-PERFECT NTA CBT EXAM INTERFACE
  // =============================================================
  return (
    <div className="h-screen w-screen flex flex-col bg-[#f0f0f0] select-none text-slate-800 overflow-hidden font-sans">
      {/* 1. NTA Top Official Header Bar */}
      <header className="bg-[#1b3a6b] text-white px-4 py-2 flex items-center justify-between border-b-2 border-orange-500">
        <div className="flex items-center space-x-3">
          <span className="bg-white text-[#1b3a6b] font-black px-2 py-0.5 rounded text-sm tracking-wider">NTA</span>
          <div className="text-xs">
            <div className="font-bold">JEE (Main) - Computer Based Test</div>
            <div className="text-slate-300 text-[10px]">Paper 1 (B.E. / B.Tech)</div>
          </div>
        </div>

        {/* Remaining Time Clock */}
        <div className="flex items-center space-x-4">
          <div className="bg-white text-slate-900 px-3 py-1 rounded flex items-center space-x-2 font-mono text-sm font-bold shadow-inner">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>Time Left: {formatTimer(timeLeft)}</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-bold flex items-center justify-center">
              C
            </div>
            <div>
              <div className="font-semibold text-[11px]">Candidate</div>
              <div className="text-slate-300 text-[9px]">Roll: 2601004589</div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Subject & Section Tabs */}
      <div className="bg-[#e4ebf5] border-b border-slate-300 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          {['Physics', 'Chemistry', 'Mathematics'].map(sub => (
            <button
              key={sub}
              onClick={() => { setSelectedSubject(sub); setCurrentIdx(0); }}
              className={`px-4 py-1.5 font-bold rounded-t text-xs transition ${
                selectedSubject === sub 
                  ? 'bg-white text-[#1b3a6b] border-t-2 border-blue-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Section A / B Toggles */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-600">Section:</span>
          {['A', 'B'].map(sec => (
            <button
              key={sec}
              onClick={() => { setSelectedSection(sec); setCurrentIdx(0); }}
              className={`px-3 py-1 rounded text-xs font-bold border ${
                selectedSection === sec 
                  ? 'bg-[#1b3a6b] text-white border-[#1b3a6b]' 
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Section {sec} ({sec === 'A' ? 'MCQ' : 'Numerical'})
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Center Split View (Question Left + Palette Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Active Question Area */}
        <div className="flex-1 flex flex-col bg-white border-r border-slate-300 overflow-y-auto">
          {/* Question Sub-header */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">
              Question No. {currentQ ? currentQ.qNum : currentIdx + 1}
            </span>
            <span className="text-slate-500 font-medium">
              Marks: <strong className="text-emerald-700">+4.00</strong>, Negative: <strong className="text-rose-700">-1.00</strong>
            </span>
          </div>

          {/* Question Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            {currentQ ? (
              <>
                <div className="text-sm leading-relaxed text-slate-900">
                  <MathText text={currentQ.text} />
                </div>

                {/* Section A: Single Choice MCQs */}
                {currentQ.section === 'A' && (
                  <div className="space-y-3 pt-2">
                    {currentQ.options.map((opt) => (
                      <label 
                        key={opt.id}
                        className={`flex items-start space-x-3 p-3 border rounded-md cursor-pointer text-xs transition ${
                          userAnswers[currentQ.id] === opt.id 
                            ? 'bg-blue-50/80 border-blue-500 font-semibold' 
                            : 'hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={`q_${currentQ.id}`} 
                          checked={userAnswers[currentQ.id] === opt.id}
                          onChange={() => setUserAnswers(prev => ({ ...prev, [currentQ.id]: opt.id }))}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <span className="mr-2 font-bold text-slate-700">({opt.id})</span>
                          <MathText text={opt.text} />
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Section B: Numerical Value Questions with NTA Keypad */}
                {currentQ.section === 'B' && (
                  <div className="pt-2 max-w-sm space-y-4">
                    <label className="block text-xs font-bold text-slate-700">
                      Enter Numeric Answer (Round to nearest integer or exact decimal):
                    </label>
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        readOnly
                        value={userAnswers[currentQ.id] || ''}
                        placeholder="Click keypad below"
                        className="w-full text-base font-mono font-bold px-3 py-2 border-2 border-blue-600 rounded bg-white text-slate-900 focus:outline-none"
                      />
                    </div>

                    {/* Authentic NTA On-Screen Virtual Keypad */}
                    <div className="bg-slate-100 p-3 rounded border border-slate-300">
                      <div className="text-[10px] text-slate-500 font-bold mb-2 uppercase text-center">NTA Virtual Numeric Keypad</div>
                      <div className="grid grid-cols-3 gap-1.5 font-bold text-sm">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '-'].map(k => (
                          <button
                            key={k}
                            onClick={() => handleKeypadPress(k)}
                            className="bg-white hover:bg-slate-200 active:bg-slate-300 p-2 rounded shadow-sm border border-slate-300"
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mt-2">
                        <button
                          onClick={() => handleKeypadPress('BACKSPACE')}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs py-2 rounded font-bold border border-amber-300"
                        >
                          Backspace
                        </button>
                        <button
                          onClick={() => handleKeypadPress('CLEAR')}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs py-2 rounded font-bold border border-rose-300"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                No questions found for this subject and section.
              </div>
            )}
          </div>

          {/* Bottom Action Control Bar */}
          <div className="bg-slate-100 border-t border-slate-300 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleSaveAndNext}
                className="bg-[#27ae60] hover:bg-[#219150] text-white px-4 py-2 rounded font-bold shadow-sm"
              >
                Save & Next
              </button>
              <button 
                onClick={handleClearResponse}
                className="bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-2 rounded font-semibold"
              >
                Clear Response
              </button>
              <button 
                onClick={handleSaveAndMarkForReview}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded font-bold shadow-sm"
              >
                Save & Mark for Review
              </button>
              <button 
                onClick={handleMarkForReviewAndNext}
                className="bg-[#8e44ad] hover:bg-[#7d3c98] text-white px-3 py-2 rounded font-bold shadow-sm"
              >
                Mark for Review & Next
              </button>
            </div>

            <button 
              onClick={() => setConfirmSubmitModal(true)}
              className="bg-[#1b3a6b] hover:bg-blue-900 text-white font-bold px-6 py-2 rounded shadow"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Right: Authentic NTA Question Palette Panel */}
        <div className="w-80 bg-white border-l border-slate-300 flex flex-col justify-between overflow-y-auto">
          <div className="p-3 space-y-4">
            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] border-b pb-3 text-slate-700 font-medium">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded bg-[#27ae60] text-white">
                  {counts.answered}
                </span>
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded bg-[#e74c3c] text-white">
                  {counts.notAnswered}
                </span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded bg-[#e0e0e0] text-gray-700">
                  {counts.notVisited}
                </span>
                <span>Not Visited</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded bg-[#8e44ad] text-white">
                  {counts.review}
                </span>
                <span>Marked for Review</span>
              </div>
              <div className="col-span-2 flex items-center space-x-1.5">
                <span className="w-5 h-5 relative flex items-center justify-center text-[10px] font-bold rounded bg-[#8e44ad] text-white">
                  {counts.ansReview}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-white"></span>
                </span>
                <span className="text-[10px] leading-tight">Ans & Marked for Review (Evaluated)</span>
              </div>
            </div>

            {/* Question Number Badges Grid */}
            <div>
              <div className="bg-[#1b3a6b] text-white text-[11px] font-bold px-2 py-1 mb-2">
                {selectedSubject} - Section {selectedSection}
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {filteredQuestions.map((q, idx) => {
                  const s = getQStatus(q.id);
                  const isCurrent = idx === currentIdx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => jumpToQuestion(idx)}
                      className={`h-9 rounded text-xs font-bold border transition flex items-center justify-center relative ${
                        STATUS_STYLES[s]?.bg || 'bg-gray-200'
                      } ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-1' : ''}`}
                    >
                      {q.qNum}
                      {s === 4 && (
                        <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-white"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Candidate Card & Exit info */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Security Strikes:</span>
              <strong className={strikes > 0 ? 'text-rose-600' : 'text-slate-700'}>{strikes} / 3</strong>
            </div>
            <div className="text-[10px] text-slate-400">Strict mode tracks Alt+Tab & window blur.</div>
          </div>
        </div>
      </div>

      {/* 4. Strike Warning Alert Modal */}
      {strikeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-center border-4 border-rose-500 animate-bounce">
            <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
            <h3 className="text-lg font-black text-rose-700 uppercase tracking-wide">
              Security Violation Detected!
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              You attempted to switch windows (Alt+Tab), change tabs, or exit Fullscreen mode.
            </p>
            <div className="bg-rose-50 border border-rose-200 p-3 rounded my-4">
              <span className="text-sm font-bold text-rose-800">
                Strike {strikes} of 3
              </span>
              <p className="text-[10px] text-rose-600 mt-0.5">
                On the 3rd strike, your examination will automatically submit immediately.
              </p>
            </div>
            <button
              onClick={() => {
                setStrikeModal(false);
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded text-xs shadow"
            >
              I Understand, Return to Test
            </button>
          </div>
        </div>
      )}

      {/* 5. Confirmation Before Submit Modal */}
      {confirmSubmitModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b pb-2">Exam Submission Summary</h3>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-2 rounded">
                <div className="font-bold text-emerald-700 text-base">{counts.answered + counts.ansReview}</div>
                <div className="text-[10px] text-emerald-800">Answered</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-2 rounded">
                <div className="font-bold text-purple-700 text-base">{counts.review}</div>
                <div className="text-[10px] text-purple-800">Marked for Review</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-2 rounded">
                <div className="font-bold text-rose-700 text-base">{counts.notAnswered + counts.notVisited}</div>
                <div className="text-[10px] text-rose-800">Unanswered</div>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to end your examination? You will not be able to change your answers after submission.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setConfirmSubmitModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
              >
                Return to Exam
              </button>
              <button
                onClick={() => {
                  setConfirmSubmitModal(false);
                  finishExam();
                }}
                className="px-5 py-1.5 text-xs font-bold bg-[#1b3a6b] hover:bg-blue-900 text-white rounded shadow"
              >
                Yes, Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
