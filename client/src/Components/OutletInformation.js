import React from "react";
const OutletInformation = props => {
  const resultOutlet = props.resultOutlet;

  if (resultOutlet.length && !props.isLoading) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Outlet Information</h5>
          <p className="card-text">{resultOutlet}</p>
        </div>
      </div>
    );
  }
  return <div />;
};
export default OutletInformation;
