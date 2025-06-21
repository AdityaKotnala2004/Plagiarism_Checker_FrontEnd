import React, { useState } from 'react';
import axios from 'axios';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('javascript', js);

export default function App() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [file1Name, setFile1Name] = useState('');
  const [file2Name, setFile2Name] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileRead = (file, setText, setFileName) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
    };
    reader.readAsText(file);
    setFileName(file.name);
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    if ((!text1.trim() && !file1Name) || (!text2.trim() && !file2Name)) {
      setError('Please provide inputs in both textareas or upload files.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('https://checkers-backend-jnkd.onrender.com/check', {
        text1,
        text2,
      });
      setResult(response.data.similarity);
    } catch (e) {
      setError('Error checking similarity. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Plagiarism Checker</h1>

      <div style={styles.inputContainer}>
        <div style={styles.box}>
          <label style={styles.label}>Input Text 1 / Upload File 1</label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Type or paste text here..."
            style={styles.textarea}
          />
          <input
            type="file"
            accept=".txt,.js,.java,.py"
            onChange={(e) =>
              e.target.files.length > 0 &&
              handleFileRead(e.target.files[0], setText1, setFile1Name)
            }
            style={styles.fileInput}
          />
          {file1Name && <p style={styles.fileName}>Uploaded: {file1Name}</p>}
          {text1 && (
            <SyntaxHighlighter language="javascript" style={docco}>
              {text1}
            </SyntaxHighlighter>
          )}
        </div>

        <div style={styles.box}>
          <label style={styles.label}>Input Text 2 / Upload File 2</label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Type or paste text here..."
            style={styles.textarea}
          />
          <input
            type="file"
            accept=".txt,.js,.java,.py"
            onChange={(e) =>
              e.target.files.length > 0 &&
              handleFileRead(e.target.files[0], setText2, setFile2Name)
            }
            style={styles.fileInput}
          />
          {file2Name && <p style={styles.fileName}>Uploaded: {file2Name}</p>}
          {text2 && (
            <SyntaxHighlighter language="javascript" style={docco}>
              {text2}
            </SyntaxHighlighter>
          )}
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading} style={styles.button}>
        {loading ? 'Checking...' : 'Check Similarity'}
      </button>

      {result !== null && (
        <div style={styles.result}>
          Similarity: <strong>{result.toFixed(2)}%</strong>
        </div>
      )}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: 900,
    margin: '20px auto',
    padding: 20,
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  },
  box: {
    flex: '1 1 45%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 6,
    boxShadow: '0 1px 8px rgba(0,0,0,0.1)',
    minWidth: 280,
  },
  label: {
    display: 'block',
    marginBottom: 8,
    fontWeight: '600',
    color: '#555',
  },
  textarea: {
    width: '100%',
    height: 120,
    padding: 10,
    fontSize: 14,
    borderRadius: 4,
    border: '1px solid #ccc',
    resize: 'vertical',
    fontFamily: 'Consolas, monospace',
  },
  fileInput: {
    marginTop: 10,
  },
  fileName: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#777',
  },
  button: {
    marginTop: 20,
    width: '100%',
    padding: 14,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  result: {
    marginTop: 25,
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  error: {
    marginTop: 15,
    textAlign: 'center',
    color: 'red',
  },
};
