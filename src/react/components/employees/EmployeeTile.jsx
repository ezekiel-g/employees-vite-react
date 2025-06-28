import { useNavigate } from 'react-router-dom';

const EmployeeTile = ({ employee }) => {
  const navigate = useNavigate();

  return (
    <div>
      <span
        onClick={() => navigate(`/employees/details/${employee.id}`)}
        style={{ cursor: 'pointer' }}
        role="button"
      >
        {employee.last_name}, {employee.first_name}
      </span>
    </div>
  );
};

export default EmployeeTile;
