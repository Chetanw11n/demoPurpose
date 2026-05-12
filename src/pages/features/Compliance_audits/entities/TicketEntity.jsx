import React from "react";

const TicketEntity = ({ entity }) => {
  return (
    <>
      <div className="detail-section">
        <h5>Ticket Information</h5>
        <div className="detail-row">
          <span className="label">Ticket ID:</span>
          <span className="value">{entity?.ticketId || "N/A"}</span>
        </div>
        <div className="detail-row">
          <span className="label">Citizen ID:</span>
          <span className="value">{entity?.citizenId || "N/A"}</span>
        </div>
        <div className="detail-row">
          <span className="label">Fare Amount:</span>
          <span className="value">${entity?.fareAmount || "N/A"}</span>
        </div>
        <div className="detail-row">
          <span className="label">Status:</span>
          <span className="value">{entity?.status || "N/A"}</span>
        </div>
        <div className="detail-row">
          <span className="label">Date:</span>
          <span className="value">
            {entity?.date ? new Date(entity.date).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>

      {entity?.route && (
        <div className="detail-section">
          <h5>Route Information</h5>
          <div className="detail-row">
            <span className="label">Route ID:</span>
            <span className="value">{entity.route.routeId || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Route Title:</span>
            <span className="value">{entity.route.title || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Route Type:</span>
            <span className="value">{entity.route.type || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Route Status:</span>
            <span className="value">{entity.route.status || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="label">Start Point:</span>
            <span className="value">{entity.route.startPoint || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="label">End Point:</span>
            <span className="value">{entity.route.endPoint || "N/A"}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketEntity;
