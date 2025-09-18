import React, { useState } from 'react';
import API from '../api';

export default function BidForm({ projectId, onBid }) {
  const [amount,setAmount] = useState('');
  const [cover,setCover] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/bids/${projectId}`, { amount: parseInt(amount,10), coverLetter: cover });
      alert('Bid placed');
      onBid?.();
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };
  return (
    <form onSubmit={submit}>
      <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" required/>
      <textarea value={cover} onChange={e=>setCover(e.target.value)} placeholder="Cover letter"/>
      <button type="submit">Place Bid</button>
    </form>
  );
}
