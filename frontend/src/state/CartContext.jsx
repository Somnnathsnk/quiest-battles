import {createContext,useContext,useEffect,useMemo,useState} from 'react';
const CartContext=createContext(null);
export function CartProvider({children}){
  const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem('qb-cart')||'[]')}catch{return []}});
  useEffect(()=>localStorage.setItem('qb-cart',JSON.stringify(items)),[items]);
  const add=(product,size='M',quantity=1)=>setItems(old=>{const key=`${product.slug}-${size}`,found=old.find(i=>i.key===key);return found?old.map(i=>i.key===key?{...i,quantity:i.quantity+quantity}:i):[...old,{...product,key,size,quantity}]});
  const update=(key,quantity)=>setItems(old=>quantity<=0?old.filter(i=>i.key!==key):old.map(i=>i.key===key?{...i,quantity}:i));
  const remove=key=>setItems(old=>old.filter(i=>i.key!==key));
  const value=useMemo(()=>({items,add,update,remove,count:items.reduce((n,i)=>n+i.quantity,0),total:items.reduce((n,i)=>n+i.price*i.quantity,0)}),[items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export const useCart=()=>useContext(CartContext);
