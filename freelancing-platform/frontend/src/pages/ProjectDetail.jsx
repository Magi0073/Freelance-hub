import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import BidForm from '../components/BidForm';
import Chat from '../components/Chat';
import PaymentButton from '../components/PaymentButton';

export default function ProjectDetail(){
  const { id } = useParams();
  const [project,setProject] = useState(null);
  useEffect(()=>{ (async ()=> { const { data } = await API.get(`/projects/${id}`); setProject(data); })(); }, [id]);
  if (!project) return <div>Loading...</div>;
  return (
    <div style={{ padding:20 }}>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <h3>Bids</h3>
      <ul>{project.bids?.map(b => <li key={b._id}>{b.coverLetter} — ₹{b.amount} — by {b.freelancer?.name}</li>)}</ul>

      <h3>Place Bid</h3>
      <BidForm projectId={id} onBid={()=>window.location.reload()}/>

      <h3>Milestones</h3>
      <ul>{project.milestones?.map((m, idx) => (
        <li key={m._id}>
          {m.title} — ₹{m.amount} — {m.status}
          {m.status === 'pending' && <PaymentButton projectId={id} milestoneIndex={idx} />}
        </li>
      ))}</ul>

      <h3>Chat</h3>
      <Chat projectId={id} />
    </div>
  );
}
