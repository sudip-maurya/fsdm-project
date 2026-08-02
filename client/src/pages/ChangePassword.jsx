import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const res = await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  // Password Strength
  const getStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1)
      return {
        text: "Weak",
        width: "30%",
        color: "#EF4444",
      };

    if (score <= 3)
      return {
        text: "Medium",
        width: "65%",
        color: "#F59E0B",
      };

    return {
      text: "Strong",
      width: "100%",
      color: "#22C55E",
    };
  };

  const strength = getStrength(newPassword);

  return (
    <div className="auth-bg">
      <div
        className="auth-card auth-change-card"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="text-center mb-4">

          <ShieldCheck
            size={50}
            color="#2563EB"
            strokeWidth={1.5}
            style={{ marginBottom: 14 }}
          />

          <h2 className="auth-title">
            Change Your Password
          </h2>

          <p className="auth-subtitle">
            Keep your account secure by creating a strong new password.
          </p>

        </div>

        {error && (
          <div className="auth-alert auth-alert-error">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="auth-alert auth-alert-success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Current Password */}

          <div style={{ marginBottom: 22 }}>

            <label className="form-label-custom">
              Current Password
            </label>

            <div className="auth-input-group auth-input-lg">

              <span className="input-group-text">
                <Lock size={18} color="#6B7280" />
              </span>

              <input
                className="form-control"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                required
              />

              <span
                className="password-toggle-btn"
                onClick={() =>
                  setShowCurrent(!showCurrent)
                }
              >
                {showCurrent ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>

            </div>
          </div>

          {/* New Password */}

          <div>

            <label className="form-label-custom">
              New Password
            </label>

            <div className="auth-input-group auth-input-lg">

              <span className="input-group-text">
                <Lock size={18} color="#6B7280" />
              </span>

              <input
                className="form-control"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
              />

              <span
                className="password-toggle-btn"
                onClick={() =>
                  setShowNew(!showNew)
                }
              >
                {showNew ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </span>

            </div>

            {newPassword && (
              <>
                <div className="password-strength">

                  <div
                    className="password-strength-fill"
                    style={{
                      width: strength.width,
                      background: strength.color,
                    }}
                  />

                </div>

                <div
                  className="password-strength-text"
                  style={{
                    color: strength.color,
                  }}
                >
                  {strength.text}
                </div>

                <div className="password-hint">
                  Use 8+ characters with uppercase,
                  lowercase, number and special character.
                </div>
              </>
            )}

          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            style={{ marginTop: 28 }}
          >
            Update Password
          </button>

        </form>

        <Link
          to="/dashboard"
          className="auth-back-link"
        >
          <ArrowLeft size={15} />
          <span>Back to Dashboard</span>
        </Link>

      </div>
    </div>
  );
};

export default ChangePassword;