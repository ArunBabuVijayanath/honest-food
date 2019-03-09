import React from "react";
const SubmitButton = props => {
  const isLoading = props.isLoading;
  if (isLoading) {
    return (
      <div className="progress">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: 100 + "%" }}
        />
      </div>
    );
  }
  return (
    <button type="submit" className="btn btn-primary">
      Search
    </button>
  );
};
export default SubmitButton;
