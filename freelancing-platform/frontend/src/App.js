import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';

export default function App(){
  return (
    <BrowserRouter>
      <nav style={{padding:10}}>
        <Link to="/">Projects</Link> | <Link to="/auth">Login/Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProjectList/>}/>
        <Route path="/auth" element={<LoginRegister/>}/>
        <Route path="/projects/:id" element={<ProjectDetail/>}/>
      </Routes>
    </BrowserRouter>
  );
}
