import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import supabase from './client';
import './App.css';
import Header from './components/header';
import Profile from './components/profile';
import Main from './components/main';
import WordPage from './components/wordPage';

function App() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    getWords();
  }, []);

  async function getWords() {
    const { data } = await supabase.from('words').select('word');
    setWords(data);
  }

  return (
    <Router>
      <div className='app-wrapper'>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
            {words.map((word) => (
              <Route key={word.word} path={`/${word.word}`} element={<WordPage word={word.word}/>} />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
