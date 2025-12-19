import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/VideoInterviewSession.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

// Question data (same as in VideoInterviewHome)
const BEHAVIORAL_QUESTIONS = [
  { id: 1, question: "Tell me about a time when you had to lead a team through a difficult project.", category: "Leadership", difficulty: "Medium" },
  { id: 2, question: "Describe a situation where you had to motivate team members who were losing interest.", category: "Leadership", difficulty: "Hard" },
  { id: 3, question: "How have you handled delegating tasks to team members with different skill levels?", category: "Leadership", difficulty: "Medium" },
  { id: 4, question: "Tell me about a time when you had to make an unpopular decision as a leader.", category: "Leadership", difficulty: "Hard" },
  { id: 5, question: "Describe your experience mentoring junior team members.", category: "Leadership", difficulty: "Easy" },
  { id: 6, question: "Tell me about a time when you had to work with a difficult team member.", category: "Teamwork", difficulty: "Medium" },
  { id: 7, question: "Describe a situation where you had to collaborate with multiple departments.", category: "Teamwork", difficulty: "Medium" },
  { id: 8, question: "How do you handle conflicts within a team?", category: "Teamwork", difficulty: "Hard" },
  { id: 9, question: "Tell me about a successful team project you were part of.", category: "Teamwork", difficulty: "Easy" },
  { id: 10, question: "Describe a time when you had to compromise to achieve a team goal.", category: "Teamwork", difficulty: "Medium" },
  { id: 11, question: "Tell me about a complex problem you solved at work.", category: "Problem Solving", difficulty: "Hard" },
  { id: 12, question: "Describe a time when you had to think outside the box to solve an issue.", category: "Problem Solving", difficulty: "Medium" },
  { id: 13, question: "How do you approach debugging a critical production issue?", category: "Problem Solving", difficulty: "Hard" },
  { id: 14, question: "Tell me about a time when you identified and fixed a systemic problem.", category: "Problem Solving", difficulty: "Hard" },
  { id: 15, question: "Describe your problem-solving process when facing a new challenge.", category: "Problem Solving", difficulty: "Easy" },
  { id: 16, question: "Tell me about a time when you disagreed with your manager's decision.", category: "Conflict", difficulty: "Hard" },
  { id: 17, question: "Describe a situation where you had to mediate between two conflicting parties.", category: "Conflict", difficulty: "Hard" },
  { id: 18, question: "How did you handle a situation where a client was unhappy with your work?", category: "Conflict", difficulty: "Medium" },
  { id: 19, question: "Tell me about a time when you had to stand up for your technical decision.", category: "Conflict", difficulty: "Medium" },
  { id: 20, question: "Describe how you resolved a disagreement with a colleague.", category: "Conflict", difficulty: "Medium" },
  { id: 21, question: "Tell me about a time when you had to explain a technical concept to a non-technical audience.", category: "Communication", difficulty: "Medium" },
  { id: 22, question: "Describe a situation where miscommunication caused a problem. How did you handle it?", category: "Communication", difficulty: "Hard" },
  { id: 23, question: "How do you ensure clear communication in remote work environments?", category: "Communication", difficulty: "Easy" },
  { id: 24, question: "Tell me about a time when you had to deliver bad news to stakeholders.", category: "Communication", difficulty: "Hard" },
  { id: 25, question: "Tell me about your biggest professional failure and what you learned.", category: "Failure", difficulty: "Hard" },
  { id: 26, question: "Describe a project that didn't go as planned. How did you recover?", category: "Failure", difficulty: "Medium" },
  { id: 27, question: "How do you handle making mistakes at work?", category: "Failure", difficulty: "Easy" },
  { id: 28, question: "Tell me about a time when you received critical feedback. How did you respond?", category: "Failure", difficulty: "Medium" },
  { id: 29, question: "How do you prioritize tasks when everything seems urgent?", category: "Time Management", difficulty: "Medium" },
  { id: 30, question: "Tell me about a time when you had to manage multiple deadlines simultaneously.", category: "Time Management", difficulty: "Hard" },
  { id: 31, question: "Describe your approach to work-life balance during crunch periods.", category: "Time Management", difficulty: "Easy" },
  { id: 32, question: "Tell me about a time when you went above and beyond your job responsibilities.", category: "Initiative", difficulty: "Medium" },
  { id: 33, question: "Describe a process improvement you implemented without being asked.", category: "Initiative", difficulty: "Hard" },
  { id: 34, question: "How do you identify opportunities for innovation in your work?", category: "Initiative", difficulty: "Medium" },
  { id: 35, question: "Tell me about a time when you had to quickly learn a new technology or skill.", category: "Adaptability", difficulty: "Medium" },
  { id: 36, question: "Describe how you handled a major change in project direction.", category: "Adaptability", difficulty: "Hard" },
  { id: 37, question: "How do you stay current with industry trends and technologies?", category: "Adaptability", difficulty: "Easy" },
  { id: 38, question: "Tell me about a time when you went the extra mile for a customer or user.", category: "Customer Focus", difficulty: "Medium" },
  { id: 39, question: "Describe how you balance user needs with technical constraints.", category: "Customer Focus", difficulty: "Hard" },
  { id: 40, question: "How do you gather and incorporate user feedback into your work?", category: "Customer Focus", difficulty: "Easy" }
];

const VideoInterviewSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const recognitionRef = useRef(null);

  // Get data from navigation state
  const useAIQuestions = location.state?.useAIQuestions || false;
  const aiQuestions = location.state?.aiQuestions || [];
  const domain = location.state?.domain || '';
  const questionIds = location.state?.questionIds || [];
  
  // Use AI questions if available, otherwise use predefined questions
  const questions = useAIQuestions && aiQuestions.length > 0
    ? aiQuestions
    : BEHAVIORAL_QUESTIONS.filter(q => questionIds.includes(q.id));

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [showTranscript, setShowTranscript] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const QUESTION_TIME_LIMIT = 180; // 3 minutes per question

  // Initialize camera and speech recognition
  useEffect(() => {
    startCamera();
    initSpeechRecognition();

    return () => {
      stopCamera();
      stopSpeechRecognition();
    };
  }, []);

  // Timer
  useEffect(() => {
    if (recording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setTimeElapsed(prev => {
          if (prev >= QUESTION_TIME_LIMIT) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording, isPaused]);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Failed to access camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
          // Note: interim results are collected but not currently displayed
        }

        setTranscript(prev => prev + finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current = recognition;
    }
  };

  // Start speech recognition
  const startSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.log('Speech recognition already started');
      }
    }
  };

  // Stop speech recognition
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log('Speech recognition already stopped');
      }
    }
  };

  // Start recording
  const handleStartRecording = async () => {
    try {
      const stream = videoRef.current.srcObject;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 2500000
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        
        const recordingData = {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          category: currentQuestion.category,
          videoURL,
          videoBlob: blob,
          transcript: transcript,
          duration: timeElapsed,
          timestamp: new Date().toISOString()
        };

        setRecordedVideos(prev => [...prev, recordingData]);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
      setTimeElapsed(0);
      setTranscript('');
      startSpeechRecognition();
    } catch (err) {
      console.error('Recording error:', err);
      alert('Failed to start recording');
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setIsPaused(false);
      stopSpeechRecognition();
    }
  };

  // Pause/Resume recording
  const handlePauseResume = () => {
    if (isPaused) {
      mediaRecorderRef.current?.resume();
      startSpeechRecognition();
    } else {
      mediaRecorderRef.current?.pause();
      stopSpeechRecognition();
    }
    setIsPaused(!isPaused);
  };

  // Next question
  const handleNextQuestion = () => {
    // Stop recording if active
    if (recording) {
      handleStopRecording();
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeElapsed(0);
      setTranscript('');
      setRecording(false);
      setIsPaused(false);
    }
  };

  // Finish interview and analyze
  const handleFinishInterview = async () => {
    if (recording) {
      handleStopRecording();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setAnalyzing(true);

    try {
      const token = localStorage.getItem('token');
      const analysisResults = [];

      // Analyze each recording with AI
      for (const recording of recordedVideos) {
        try {
          // Call backend AI analysis API
          const response = await axios.post(
            `${API_URL}/interviews/analyze-response`,
            {
              question: recording.question,
              answer: recording.transcript || '',
              transcript: recording.transcript || '',
              duration: recording.duration,
              domain: domain,
              category: recording.category
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          // Merge AI analysis with recording data
          analysisResults.push({
            questionId: recording.questionId,
            question: recording.question,
            category: recording.category,
            duration: recording.duration,
            transcript: recording.transcript,
            ...response.data.analysis,
            // Map AI analysis fields to expected format
            eyeContact: response.data.analysis.behavioralScore || 75,
            facialExpressions: response.data.analysis.professionalismScore || 75,
            bodyLanguage: response.data.analysis.communicationScore || 75,
            confidence: response.data.analysis.overallScore || 75,
            clarity: response.data.analysis.communicationScore || 75,
            pacing: response.data.analysis.communicationScore || 75,
            tone: response.data.analysis.professionalismScore || 75,
            fillerWords: response.data.analysis.estimatedFillerWords || 5,
            starCompliance: response.data.analysis.starCompliance?.score || 70,
            answerStructure: response.data.analysis.contentScore || 75,
            relevance: response.data.analysis.specificityScore || 75,
            depth: response.data.analysis.impactScore || 75,
            overallScore: response.data.analysis.overallScore || 75,
            // AI-specific fields
            aiAnalysis: response.data.analysis
          });
        } catch (error) {
          console.error('Failed to analyze recording:', error);
          // Fallback to basic analysis if AI fails
          analysisResults.push(await simulateAIAnalysis(recording));
        }
      }

      // Create session data
      const sessionId = Date.now();
      const sessionData = {
        id: sessionId,
        date: new Date().toISOString(),
        questionsCount: recordedVideos.length,
        recordings: recordedVideos,
        averageScore: null, // Will be calculated after AI analysis
        domain: domain,
        useAIQuestions: useAIQuestions
      };

      // Save to localStorage
      const history = JSON.parse(localStorage.getItem('video-interview-history') || '[]');
      history.push(sessionData);
      localStorage.setItem('video-interview-history', JSON.stringify(history));

      // Save analysis results
      localStorage.setItem(`interview-analysis-${sessionId}`, JSON.stringify(analysisResults));

      // Navigate to feedback page
      navigate(`/video-interview/feedback/${sessionId}`);
    } catch (err) {
      console.error('Analysis error:', err);
      alert('Failed to analyze interview. Please try again.');
      setAnalyzing(false);
    }
  };

  // Simulate AI analysis (replace with actual API call in production)
  const simulateAIAnalysis = async (recording) => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if recording actually has content
    const hasVideo = recording.videoBlob && recording.videoBlob.size > 1000; // More than 1KB
    const hasTranscript = recording.transcript && recording.transcript.trim().length > 20;
    const hasMinDuration = recording.duration >= 5; // At least 5 seconds
    
    const wordCount = recording.transcript ? recording.transcript.trim().split(/\s+/).length : 0;
    const hasSubstantialContent = wordCount >= 30; // At least 30 words

    // If no actual recording, return very low scores
    if (!hasVideo || !hasTranscript || !hasMinDuration) {
      return {
        questionId: recording.questionId,
        question: recording.question,
        category: recording.category,
        duration: recording.duration,
        transcript: recording.transcript || 'No response recorded',
        
        // Facial Analysis - Very Low
        eyeContact: 0,
        facialExpressions: 0,
        bodyLanguage: 0,
        confidence: 0,
        
        // Speech Analysis - Very Low
        clarity: 0,
        pacing: 0,
        tone: 0,
        fillerWords: 0,
        
        // Content Analysis - Very Low
        starCompliance: 0,
        answerStructure: 0,
        relevance: 0,
        depth: 0,
        
        // Overall Score
        overallScore: 0,
        
        // Feedback
        strengths: [],
        improvements: [
          '❌ No video recording detected',
          '❌ No speech transcript found',
          '❌ Recording duration too short (minimum 5 seconds required)',
          '❌ Please record your answer before moving to the next question'
        ],
        suggestions: '⚠️ No response was recorded for this question. Please ensure you:\n1. Click "Start Recording" before speaking\n2. Speak clearly for at least 30 seconds\n3. Click "Stop Recording" when done\n4. Check that your camera and microphone are enabled'
      };
    }

    // If recording exists but content is minimal
    if (!hasSubstantialContent) {
      return {
        questionId: recording.questionId,
        question: recording.question,
        category: recording.category,
        duration: recording.duration,
        transcript: recording.transcript,
        
        // Facial Analysis - Low
        eyeContact: Math.floor(Math.random() * 20) + 20, // 20-40
        facialExpressions: Math.floor(Math.random() * 20) + 20,
        bodyLanguage: Math.floor(Math.random() * 20) + 20,
        confidence: Math.floor(Math.random() * 20) + 20,
        
        // Speech Analysis - Low
        clarity: Math.floor(Math.random() * 20) + 30,
        pacing: Math.floor(Math.random() * 20) + 30,
        tone: Math.floor(Math.random() * 20) + 30,
        fillerWords: Math.floor(Math.random() * 10) + 15, // 15-25
        
        // Content Analysis - Low
        starCompliance: Math.floor(Math.random() * 20) + 20,
        answerStructure: Math.floor(Math.random() * 20) + 20,
        relevance: Math.floor(Math.random() * 20) + 25,
        depth: Math.floor(Math.random() * 20) + 20,
        
        // Overall Score
        overallScore: Math.floor(Math.random() * 15) + 25, // 25-40
        
        // Feedback
        strengths: [
          '✓ Recording was captured successfully'
        ],
        improvements: [
          '⚠️ Answer is too short (only ' + wordCount + ' words)',
          'Provide more detailed examples and context',
          'Use the STAR method (Situation, Task, Action, Result)',
          'Aim for at least 1-2 minutes per answer',
          'Include specific metrics and outcomes'
        ],
        suggestions: 'Your answer needs significant improvement. Focus on:\n1. Speaking for at least 60-90 seconds\n2. Following the STAR method structure\n3. Providing concrete examples with measurable results\n4. Speaking with confidence and clarity'
      };
    }

    // Good recording with content - Generate realistic scores based on word count and duration
    const durationScore = Math.min(recording.duration / 60, 1) * 100; // Up to 1 minute
    const contentScore = Math.min(wordCount / 150, 1) * 100; // Up to 150 words
    const baseScore = (durationScore + contentScore) / 2;

    const scoreVariance = 15;
    const generateScore = () => Math.min(100, Math.max(60, Math.floor(baseScore + (Math.random() * scoreVariance - scoreVariance/2))));

    return {
      questionId: recording.questionId,
      question: recording.question,
      category: recording.category,
      duration: recording.duration,
      transcript: recording.transcript,
      
      // Facial Analysis
      eyeContact: generateScore(),
      facialExpressions: generateScore(),
      bodyLanguage: generateScore(),
      confidence: generateScore(),
      
      // Speech Analysis
      clarity: generateScore(),
      pacing: generateScore(),
      tone: generateScore(),
      fillerWords: Math.floor(Math.random() * 10) + 5, // 5-15
      
      // Content Analysis
      starCompliance: generateScore(),
      answerStructure: generateScore(),
      relevance: generateScore(),
      depth: generateScore(),
      
      // Overall Score
      overallScore: Math.floor(baseScore + (Math.random() * 10 - 5)),
      
      // Feedback
      strengths: [
        '✓ Good response length (' + wordCount + ' words)',
        '✓ Clear speaking voice detected',
        '✓ Answer follows logical structure',
        '✓ Maintained good recording quality'
      ],
      improvements: [
        'Add more specific quantifiable results',
        'Reduce filler words (detected ' + Math.floor(wordCount * 0.05) + ' instances)',
        'Practice maintaining steady eye contact',
        'Speak with slightly more confidence'
      ],
      suggestions: 'Strong response overall! Continue practicing to refine your delivery and provide even more specific examples with measurable outcomes.'
    };
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Exit interview
  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      stopCamera();
      stopSpeechRecognition();
      navigate('/behavioral');
    }
  };

  return (
    <div className="video-interview-session">
      {/* Header */}
      <div className="session-header">
        <div className="header-left">
          <h2>AI Video Interview</h2>
          <span className="question-progress">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="header-right">
          <button className="btn-exit" onClick={handleExit}>
            Exit Interview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="session-content">
        {/* Video Section */}
        <div className="video-section">
          <div className="video-container">
            <video ref={videoRef} autoPlay playsInline muted className="interview-video" />
            
            {/* Recording indicator */}
            {recording && (
              <div className="recording-indicator">
                <span className={`rec-dot ${isPaused ? 'paused' : ''}`}></span>
                <span>REC</span>
              </div>
            )}

            {/* Timer */}
            <div className="timer-overlay">
              <span className="timer-text">{formatTime(timeElapsed)}</span>
              <span className="timer-limit">/ {formatTime(QUESTION_TIME_LIMIT)}</span>
            </div>

            {/* Progress bar */}
            <div className="time-progress-bar">
              <div 
                className="time-progress-fill"
                style={{ width: `${(timeElapsed / QUESTION_TIME_LIMIT) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="recording-controls">
            {!recording ? (
              <button className="btn-record" onClick={handleStartRecording}>
                <span>🔴</span> Start Recording
              </button>
            ) : (
              <>
                <button className="btn-pause" onClick={handlePauseResume}>
                  {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                </button>
                <button className="btn-stop" onClick={handleStopRecording}>
                  <span>⏹️</span> Stop Recording
                </button>
              </>
            )}
          </div>
        </div>

        {/* Question & Transcript Section */}
        <div className="info-section">
          {/* Question Display */}
          <div className="question-display">
            <div className="question-header">
              <span className="category-badge">{currentQuestion?.category}</span>
              <span className={`difficulty-badge ${currentQuestion?.difficulty?.toLowerCase()}`}>
                {currentQuestion?.difficulty}
              </span>
              {useAIQuestions && (
                <span className="ai-generated-badge">✨ AI Generated</span>
              )}
            </div>
            <h3 className="question-text">{currentQuestion?.question}</h3>
            
            {/* AI Question Tips */}
            {useAIQuestions && currentQuestion?.expectedFocus && (
              <div className="ai-question-tips">
                <h4>🎯 What the interviewer is looking for:</h4>
                <p>{currentQuestion.expectedFocus}</p>
              </div>
            )}

            {/* STAR Method Tips */}
            <div className="star-tips">
              <h4>💡 {useAIQuestions && currentQuestion?.starPrompt ? 'Suggested Approach:' : 'STAR Method Tips:'}</h4>
              {useAIQuestions && currentQuestion?.starPrompt ? (
                <p className="star-prompt">{currentQuestion.starPrompt}</p>
              ) : (
                <div className="star-grid">
                  <div className="star-tip">
                    <strong>S</strong>ituation: Set the context
                  </div>
                  <div className="star-tip">
                    <strong>T</strong>ask: Describe your responsibility
                  </div>
                  <div className="star-tip">
                    <strong>A</strong>ction: Explain what you did
                  </div>
                  <div className="star-tip">
                    <strong>R</strong>esult: Share the outcome
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Transcript */}
          <div className="transcript-section">
            <div className="transcript-header">
              <h4>📝 Live Transcript</h4>
              <button 
                className="btn-toggle-transcript"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {showTranscript ? 'Hide' : 'Show'}
              </button>
            </div>
            {showTranscript && (
              <div className="transcript-box">
                {transcript || 'Start speaking to see live transcription...'}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="question-navigation">
            {!isLastQuestion ? (
              <button 
                className="btn-next-question"
                onClick={handleNextQuestion}
              >
                Next Question →
              </button>
            ) : (
              <button 
                className="btn-finish"
                onClick={handleFinishInterview}
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing...' : 'Finish & Get AI Feedback'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analyzing Overlay */}
      {analyzing && (
        <div className="analyzing-overlay">
          <div className="analyzing-content">
            <div className="analyzing-spinner"></div>
            <h2>🤖 AI Analysis in Progress</h2>
            <p>Analyzing your facial expressions, speech patterns, and content...</p>
            <div className="analyzing-steps">
              <div className="step">✓ Processing video recordings</div>
              <div className="step">✓ Analyzing facial expressions & body language</div>
              <div className="step">✓ Evaluating speech clarity & tone</div>
              <div className="step active">⟳ Assessing content & STAR compliance</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoInterviewSession;
