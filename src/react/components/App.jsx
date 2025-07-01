import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import MainPage from './MainPage';
import ShowDepartmentPage from './departments/ShowDepartmentPage';
import AddDepartmentPage from './departments/AddDepartmentPage';
import EditDepartmentPage from './departments/EditDepartmentPage';
import ShowEmployeePage from './employees/ShowEmployeePage';
import AddEmployeePage from './employees/AddEmployeePage';
import EditEmployeePage from './employees/EditEmployeePage';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/departments/details/:id"
          element={<ShowDepartmentPage />}
        />
        <Route path="/departments/add" element={<AddDepartmentPage />} />
        <Route path="/departments/edit/:id" element={<EditDepartmentPage />} />
        <Route path="/employees/details/:id" element={<ShowEmployeePage />} />
        <Route path="/employees/add" element={<AddEmployeePage />} />
        <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
