import {createContext,useContext,useEffect,useMemo,useState} from 'react';

const AuthContext=createContext(null);
export function AuthProvider({children}){
  const [token,setToken]=useState(()=>localStorage.getItem('qb-token'));
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('qb-user')||'null')}catch{return null}});
  const [loading,setLoading]=useState(Boolean(token));
  const clear=()=>{localStorage.removeItem('qb-token');localStorage.removeItem('qb-user');setToken(null);setUser(null)};
  useEffect(()=>{if(!token){setLoading(false);return}fetch('/api/auth/me',{headers:{Authorization:`Bearer ${token}`}}).then(r=>r.ok?r.json():null).then(d=>{if(d?.user){setUser(d.user);localStorage.setItem('qb-user',JSON.stringify(d.user))}else clear()}).catch(()=>{}).finally(()=>setLoading(false))},[token]);
  async function authenticate(path,payload){const r=await fetch(`/api/auth/${path}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw Error(d.message||'Could not authenticate.');localStorage.setItem('qb-token',d.token);localStorage.setItem('qb-user',JSON.stringify(d.user));setToken(d.token);setUser(d.user);return d.user}
  const value=useMemo(()=>({token,user,loading,login:(email,password)=>authenticate('login',{email,password}),register:(name,email,password)=>authenticate('customer/register',{name,email,password}),logout:clear}),[token,user,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
