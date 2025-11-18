import React from 'react';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import { createRoot } from 'react-dom/client';

//Pages 
import Login from './pages/login.jsx';
import Support from './pages/support.jsx';
import RegisterStudent from './pages/registerStudent.jsx'
import DelayControl from './pages/delayControl.jsx'; 
import RegisterEmployee from './pages/registerEmployee.jsx';
import FirstAccessSelectRole from '../src/pages/firstAccessSelectRole.jsx'

import './index.css';

import { AuthProvider } from './context/authContext.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';


const router = createBrowserRouter([
  {path: '/', element: <PrivateRoute element={<RegisterStudent/>}/>},
  {path: '/login', element: <Login />},
  {path: '/suporte', element: <Support />},
  {path: '/primeiro-acesso', element: <FirstAccessSelectRole />},
  {path: '/atrasos', element: <PrivateRoute element={<DelayControl/>}/>},
  {path: '/registrar-aluno', element: <PrivateRoute element={<RegisterStudent/>}/>},
  {path: '/registrar-funcionario', element: <PrivateRoute element={<RegisterEmployee/>}/>},
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);