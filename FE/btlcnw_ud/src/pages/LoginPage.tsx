import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { login } from "../services/authService";
import { useAppContext } from "../context/AppContext";
import "../assets/styles/login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUsername: setAppUsername } = useAppContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user, token } = await login({ username, password });

      localStorage.setItem("user", JSON.stringify(user));
      setAppUsername(
        user.displayName ?? user.name ?? user.fullName ?? user.username
      );

      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        localStorage.removeItem("authToken");
      }

      navigate("/dashboard");
    } catch (requestError) {
      const fallbackMessage = "Tên người dùng hoặc mật khẩu không đúng.";

      if (requestError instanceof AxiosError) {
        const apiMessage =
          (requestError.response?.data as { message?: string } | undefined)
            ?.message;
        setError(apiMessage || fallbackMessage);
      } else {
        setError(fallbackMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="login-hero-overlay" />
        <div className="login-hero-content">
          <p className="login-hero-kicker">WELCOME COFFEE MANAGEMENT SYSTEM</p>
          <h1 className="login-hero-title">ADMIN DASHBOARD</h1>
          <p className="login-hero-description">
            Hệ thống quản lý quán cafe giúp bạn theo dõi đơn hàng,
            quản lý nhân viên,kiểm soát kho và tối ưu hoạt động
            kinh doanh một cách hiệu quả.
          </p>
        </div>
        <div className="login-hero-circle login-hero-circle-lg" />
        <div className="login-hero-circle login-hero-circle-sm" />
      </section>

      <section className="login-form-shell">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2 className="login-card-title">Sign in</h2>
          <div className="login-field">
            <label htmlFor="username">User name</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                className="login-toggle-password"
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="login-options-row">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button className="login-submit-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {error ? (
            <p className="login-error-message" role="alert">
              {error}
            </p>
          ) : null}


        </form>
      </section>
    </div>
  );
};

export default LoginPage;
