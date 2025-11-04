import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/CodeEditor.css';

const CodeEditor = ({ setNotification }) => {
  const { token } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (difficultyFilter !== 'all') params.difficulty = difficultyFilter;
      if (topicFilter !== 'all') params.topic = topicFilter;

      const response = await axios.get(`${API_URL}/api/resources/code-editor/problems`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Problems response:', response.data);
      setProblems(response.data.problems || response.data.data || []);
    } catch (error) {
      console.error('Fetch problems error:', error);
      setNotification({ type: 'error', message: 'Failed to fetch problems' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficultyFilter, topicFilter]);

  const selectProblem = async (problem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode || '// Write your code here\n');
    setOutput('');

    // Fetch full problem details if needed
    try {
      const response = await axios.get(`${API_URL}/api/resources/code-editor/problem/${problem.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Problem details response:', response.data);
      setSelectedProblem(response.data.problem || response.data.data || problem);
    } catch (error) {
      console.error('Error fetching problem details:', error);
    }
  };

  const executeCode = async () => {
    if (!selectedProblem) {
      setNotification({ type: 'error', message: 'Please select a problem' });
      return;
    }

    setExecuting(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/resources/code-editor/execute`,
        {
          code,
          language: selectedProblem.language || 'python',
          input: selectedProblem.testInput || ''
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setOutput(response.data.output || 'Code executed successfully');
      
      if (response.data.success) {
        setNotification({ type: 'success', message: '✅ All test cases passed!' });
      }
    } catch (error) {
      setOutput(error.response?.data?.error || 'Execution failed');
      setNotification({ type: 'error', message: 'Code execution error' });
    } finally {
      setExecuting(false);
    }
  };

  const submitSolution = async () => {
    if (!selectedProblem) return;

    try {
      // Here you would submit the solution to the backend
      setNotification({ type: 'success', message: 'Solution submitted successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to submit solution' });
    }
  };

  return (
    <div className="code-editor">
      <h2>💻 Interactive Code Editor</h2>
      <p className="subtitle">Practice coding problems with real-time execution</p>

      <div className="editor-container">
        {/* Left Sidebar - Problems List */}
        <div className="problems-panel">
          <h3>Problems</h3>

          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <label>Difficulty</label>
              <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Topic</label>
              <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
                <option value="all">All Topics</option>
                <option value="Array">Array</option>
                <option value="String">String</option>
                <option value="LinkedList">Linked List</option>
                <option value="Tree">Tree</option>
                <option value="Graph">Graph</option>
                <option value="DP">Dynamic Programming</option>
              </select>
            </div>
          </div>

          {/* Problems List */}
          <div className="problems-list">
            {loading ? (
              <div className="loading">Loading problems...</div>
            ) : problems.length === 0 ? (
              <div className="no-problems">No problems found</div>
            ) : (
              problems.map(problem => (
                <div
                  key={problem.id}
                  className={`problem-item ${selectedProblem?.id === problem.id ? 'active' : ''}`}
                  onClick={() => selectProblem(problem)}
                >
                  <div className="problem-number">{problem.number}</div>
                  <div className="problem-info">
                    <h4>{problem.title}</h4>
                    <span className={`difficulty ${problem.difficulty?.toLowerCase() || 'medium'}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  {problem.solved && <span className="solved-badge">✓</span>}
                </div>
              ))
            )}
          </div>

          <button className="view-all-btn">View All Problems</button>
        </div>

        {/* Right Panel - Editor */}
        {selectedProblem ? (
          <div className="editor-panel">
            {/* Problem Description */}
            <div className="problem-description">
              <h3>{selectedProblem.title}</h3>
              <div className="problem-meta">
                <span className={`difficulty ${selectedProblem.difficulty?.toLowerCase() || 'medium'}`}>
                  {selectedProblem.difficulty}
                </span>
                <span className="acceptance">{selectedProblem.acceptance || 'N/A'}% Acceptance</span>
              </div>

              <div className="description-content">
                <h4>Description</h4>
                <p>{selectedProblem.description}</p>

                {selectedProblem.examples && (
                  <>
                    <h4>Examples</h4>
                    {selectedProblem.examples.map((example, idx) => (
                      <div key={idx} className="example">
                        <div className="example-input">
                          <strong>Input:</strong>
                          <code>{example.input}</code>
                        </div>
                        <div className="example-output">
                          <strong>Output:</strong>
                          <code>{example.output}</code>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {selectedProblem.constraints && (
                  <>
                    <h4>Constraints</h4>
                    <ul>
                      {selectedProblem.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <div className="code-section">
              <div className="editor-header">
                <h4>Code</h4>
                <select className="language-select">
                  <option>Python</option>
                  <option>JavaScript</option>
                  <option>Java</option>
                  <option>C++</option>
                </select>
              </div>

              <textarea
                className="editor-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Write your solution here"
              />

              <div className="editor-actions">
                <button className="run-btn" onClick={executeCode} disabled={executing}>
                  {executing ? '⏳ Running...' : '▶️ Run Code'}
                </button>
                <button className="submit-btn" onClick={submitSolution}>
                  ✅ Submit Solution
                </button>
                <button className="reset-btn" onClick={() => setCode(selectedProblem.starterCode || '')}>
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Output */}
            {output && (
              <div className="output-section">
                <h4>Output</h4>
                <div className="output-box">
                  <pre>{output}</pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="empty-editor">
            <div className="empty-icon">📝</div>
            <p>Select a problem to start coding</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
