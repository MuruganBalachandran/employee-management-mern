// region imports
import React from "react";
import { passwordRules } from "../../validations/authValidation";
// endregion

const PasswordRules = ({ password="" }) => {
  // region use rules
  const rules = passwordRules(password);

  const Rule = ({ valid, label }) => (
    <div className="d-flex align-items-center mb-1">
      <span style={{ color: valid ? "#28a745" : "#dc3545", fontWeight: "bold" }}>
        {valid ? "✔" : "✖"}
      </span>
      <span
        className="ms-2"
        style={{ color: valid ? "#28a745" : "#dc3545" }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div className="mt-2 small">
      <Rule valid={rules.length} label="At least 8 characters" />
      <Rule valid={rules.lowercase} label="At least 1 lowercase" />
      <Rule valid={rules.uppercase} label="At least 1 uppercase" />
      <Rule valid={rules.number} label="At least 1 number" />
      <Rule valid={rules.special} label="At least 1 special character" />
    </div>
  );
};

// region exports
export default PasswordRules;
// endregion
