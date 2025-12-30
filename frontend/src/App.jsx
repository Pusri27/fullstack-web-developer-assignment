import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ArticleList />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
