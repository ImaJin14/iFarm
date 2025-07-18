import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Management from './pages/Management';
import Education from './pages/Education';
import Contact from './pages/Contact';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import BreedDetail from './pages/BreedDetail';
import AnimalDetail from './pages/AnimalDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/breeds/:id" element={<BreedDetail />} />
            <Route path="/animals/:id" element={<AnimalDetail />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/management" element={<Management />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;