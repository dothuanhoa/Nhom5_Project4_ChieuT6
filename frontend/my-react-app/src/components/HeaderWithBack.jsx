import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderWithBack({ title }) {
  const navigate = useNavigate();

  return (
    <div className="header-with-back" style={{ marginBottom: "20px" }}>
      <button
        className="btn-back"
        onClick={() => navigate(-1)} 
        title="Quay lại"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <h2 className="dashboard-title">{title}</h2>
    </div>
  );
}
