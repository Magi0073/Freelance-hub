import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function LoginRegister(){
  const [isLogin,setIsLogin] = useState(true);
  const [form,setForm] = useState({ name:'', email:'', password:'', role:'client' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await API.post('/auth/login', { email: form.email, password: form.password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        nav('/');
      } else {
        const { data } = await API.post('/auth/register', form);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        nav('/');
      }
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };

  return (
    <div style={{ padding:20 }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={submit}>
        {!isLogin && <input placeholder="Name" required value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>}
        <input placeholder="Email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input placeholder="Password" type="password" required value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        {!isLogin && (
          <div>
            <label><input type="radio" name="role" checked={form.role==='client'} onChange={()=>setForm({...form,role:'client'})}/> Client</label>
            <label style={{marginLeft:10}}><input type="radio" name="role" checked={form.role==='freelancer'} onChange={()=>setForm({...form,role:'freelancer'})}/> Freelancer</label>
          </div>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={()=>setIsLogin(p=>!p)} style={{marginTop:10}}>{isLogin ? 'Switch to register' : 'Switch to login'}</button>
    </div>
  );
}
