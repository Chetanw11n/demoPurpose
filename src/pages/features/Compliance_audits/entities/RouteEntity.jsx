import React from "react";

const RouteEntity = ({ entity }) => {
  return (
    <div className="detail-section">
      <h5>Route Information</h5>
      <div className="detail-row">
        <span className="label">Route ID:</span>
        <span className="value">{entity?.routeId || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="label">Title:</span>
        <span className="value">{entity?.title || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="label">Type:</span>
        <span className="value">{entity?.type || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="label">Status:</span>
        <span className="value">{entity?.status || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="label">Start Point:</span>
        <span className="value">{entity?.startPoint || "N/A"}</span>
      </div>
      <div className="detail-row">
        <span className="label">End Point:</span>
        <span className="value">{entity?.endPoint || "N/A"}</span>
      </div>
    </div>
  );
};

export default RouteEntity;
