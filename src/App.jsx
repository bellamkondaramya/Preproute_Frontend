import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateTest from './pages/CreateTest.jsx';
import QuestionBuilder from './pages/QuestionBuilder.jsx';
import PublishTest from './pages/PublishTest.jsx';
import TestTracking from './pages/TestTracking.jsx';

function Protected({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected><AppShell /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tests/create" element={<CreateTest />} />
        <Route path="tests/:id/edit" element={<CreateTest editMode />} />
        <Route path="tests/:id/questions" element={<QuestionBuilder />} />
        <Route path="tests/:id/publish" element={<PublishTest />} />
        <Route path="tracking" element={<TestTracking />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
