import { useState } from 'react';
import Quiz from "./components/Quiz";
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  if (isAdminMode) {
    return <AdminDashboard />;
  }

  return (
    <div className="container">
      <div className="app-header">
        <h1>Quiz Vui</h1>
      </div>
      <Quiz />
      <div>
        <button
          onClick={toggleAdminMode}
          className="admin-toggle-btn"
          title="Chuyển sang chế độ Admin"
        >
          Vùng cấm ❌
        </button>
      </div>
    </div>
  );
}

export default App;
