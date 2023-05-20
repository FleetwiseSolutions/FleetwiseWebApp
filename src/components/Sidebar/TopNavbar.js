import React from "react";
import "./TopNavbar.css";
import { Button } from "react-bootstrap";

const TopNavbar = ({ roles, onRoleSelect, onLogout }) => {
  return (
    <div className="TopNavbar">
      <h3>User Roles</h3>
      <ul>
        {roles.map((role, index) => (
          <li key={index} onClick={() => onRoleSelect(role)}>
            {role}
          </li>
        ))}
      </ul>
      <Button variant="danger" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
};

export default TopNavbar;
