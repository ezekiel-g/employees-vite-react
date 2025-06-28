import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar px-2 py-3 border-bottom">
      <div className="container-fluid d-flex justify-content-between">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <div className="ms-auto">
          <Link to="/departments/add" className="nav-link d-inline-block me-3">
            Add Department
          </Link>
          <Link to="/employees/add" className="nav-link d-inline-block">
            Add Employee
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
