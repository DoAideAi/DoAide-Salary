import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import CalculatorPage from './pages/CalculatorPage';
import ComparatorPage from './pages/ComparatorPage';
import SalaryHikePage from './pages/SalaryHikePage';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import useSEO from './hooks/useSEO';

// Keeps <head> in sync with routeMeta on client-side navigation.
function RouteSEO() {
  useSEO(useLocation().pathname.replace(/\/+$/, '') || '/');
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteSEO />
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/compare" element={<ComparatorPage />} />
          <Route path="/hike" element={<SalaryHikePage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
