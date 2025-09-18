import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function ProjectList(){
  const [projects,setProjects] = useState([]);
  useEffect(()=>{ (async ()=> { const { data } = await API.get('/projects'); setProjects(data); })(); }, []);
  return (
    <div style={{ padding:20 }}>
      <h2>Projects</h2>
      <ul>
        {projects.map(p => <li key={p._id}><Link to={`/projects/${p._id}`}>{p.title}</Link> — by {p.client?.name}</li>)}
      </ul>
    </div>
  );
}
