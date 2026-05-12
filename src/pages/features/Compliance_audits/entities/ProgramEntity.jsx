import React from "react";

const ProgramEntity = ({ entity }) => {
  return (
    <div className="detail-section">
      <h5>Program Information</h5>
      <div className="detail-row">
        <span className="label">Program ID:</span>
        <span className="value">{entity?.programId || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="label">Title:</span>
        <span className="value">{entity?.title || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="label">Description:</span>
        <span className="value">{entity?.description || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="label">Status:</span>
        <span className="value">{entity?.status || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="label">Start Date:</span>
        <span className="value">
          {entity?.startDate ? new Date(entity.startDate).toLocaleDateString() : "N/A"}
        </span>
      </div>
      <div className="detail-row">
        <span className="label">End Date:</span>
        <span className="value">
          {entity?.endDate ? new Date(entity.endDate).toLocaleDateString() : "N/A"}
        </span>
      </div>
      <div className="detail-row">
        <span className="label">Budget:</span>
        <span className="value">${entity?.budget?.toLocaleString() || "N/A"}</span>
      </div>
    </div>
  );
};

export default ProgramEntity;
