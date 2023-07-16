import React from "react";
import "./TopNavbar.css";
import { Button } from "react-bootstrap";

const TopNavbar = ({ roles, onRoleSelect, onLogout, onSidebarShow }) => {
  return (
    <div className="TopNavbar">
        <div className="buffer"></div>
      <h3>Roles</h3>
      <ul>
        {roles.map((role, index) => (
          <li key={index} onClick={() => onRoleSelect(role)}>
            {role}
          </li>
        ))}
      </ul>
        <Button className="d-md-none" variant="warning" onClick={onSidebarShow}>
            |||
        </Button>
      <Button variant="danger" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
};

export default TopNavbar;
