import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {CartProvider} from './state/CartContext';
import {AuthProvider} from './state/AuthContext';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><AuthProvider><CartProvider><App/></CartProvider></AuthProvider></BrowserRouter></React.StrictMode>);
