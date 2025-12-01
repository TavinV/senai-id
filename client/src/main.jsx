import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";

//Pages
import Login from "./pages/login.jsx";
import Support from "./pages/support.jsx";
import DelayControl from "./pages/delayControl.jsx";
import LeavesControl from "./pages/leavesControl.jsx";
import RegisterStudent from "./pages/registerStudent.jsx";
import AccountsControl from "./pages/accountsControl.jsx";
import RegisterEmployee from "./pages/registerEmployee.jsx";
import FirstAccessSelectRole from "../src/pages/firstAccessSelectRole.jsx";
import ConfirmCpf from "./pages/confirmCpf.jsx";
import CardAccess from "./pages/cardAccess.jsx";
import EditUser from "./pages/editUser.jsx";
import AskForDelay from "./pages/askForDelay.jsx";
import LateEntriesHistory from "./pages/lateEntriesHistory.jsx";
import MyLateEntries from "./pages/myLateEntries.jsx";

import TestUsers from "./pages/testUsers.jsx";
import TestLateEntriesStudent from "./pages/testAtrasos.jsx";
import TestLateEntriesAdmin from "./pages/testLateEntriesAdmin.jsx";
import TestEarlyExitsStudent from "./pages/testEarlyExits.jsx";
import TestEarlyExitsAdmin from "./pages/testEarlyExitsAdmin.jsx";

// CSS

import "./index.css";

import { AuthProvider } from "./context/authContext.jsx";
import PrivateRoute from "./components/auth/PrivateRoute.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/suporte", element: <Support /> },
  { path: "/primeiro-acesso", element: <FirstAccessSelectRole /> },
  { path: "/confirmar-cpf", element: <ConfirmCpf /> },
  { path: "/teste-usuarios", element: <TestUsers /> },
  { path: "/teste-atrasos", element: <TestLateEntriesStudent /> },
  { path: "/teste-atrasos-admin", element: <TestLateEntriesAdmin /> },
  { path: "/teste-saidas", element: <TestEarlyExitsStudent /> },
  { path: "/teste-saidas-admin", element: <TestEarlyExitsAdmin /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <AccountsControl />
      </PrivateRoute>
    ),
  },
  {
    path: "/liberacoes",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <DelayControl />
      </PrivateRoute>
    ),
  },
  {
    path: "/usuarios",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <AccountsControl />
      </PrivateRoute>
    ),
  },
  {
    path: "/mensagens",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <Support />
      </PrivateRoute>
    ),
  },
  {
    path: "/atrasos",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <DelayControl />
      </PrivateRoute>
    ),
  },
  {
    path: "/saidas",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <LeavesControl />
      </PrivateRoute>
    ),
  },
  {
    path: "/contas",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <AccountsControl />
      </PrivateRoute>
    ),
  },
  {
    path: "/registrar-aluno",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <RegisterStudent />
      </PrivateRoute>
    ),
  },
  {
    path: "/registrar-funcionario",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <RegisterEmployee />
      </PrivateRoute>
    ),
  },
  {
    path: "/carteirinha",
    element: (
      <PrivateRoute allowedRoles={["aluno", "funcionario"]}>
        <CardAccess />
      </PrivateRoute>
    ),
  },
  {
    path: "/pedir-atraso",
    element: (
      <PrivateRoute allowedRoles={["aluno"]}>
        <AskForDelay />
      </PrivateRoute>
    ),
  },
  {
    path: "/historico-atrasos",
    element: (
      <PrivateRoute allowedRoles={["aluno"]}>
        <LateEntriesHistory />
      </PrivateRoute>
    ),
  },
  {
    path: "/meus-atrasos",
    element: (
      <PrivateRoute allowedRoles={["aluno"]}>
        <MyLateEntries />
      </PrivateRoute>
    ),
  },
  {
    path: "/contas/editar/:id",
    element: (
      <PrivateRoute allowedRoles={["secretaria"]}>
        <EditUser />
      </PrivateRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
