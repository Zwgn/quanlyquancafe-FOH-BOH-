import React from "react";
import {
  MdLocalCafe,
  MdLock,
  MdLogin,
  MdPerson,
  MdVisibility,
  MdVisibilityOff
} from "react-icons/md";
import logo from "../assets/images/logo.png";
import useLogin from "../hooks/useLogin";
import "../assets/styles/login.css";

const LoginPage = () => {
  const {
    username, setUsername,
    password, setPassword,
    rememberMe, setRememberMe,
    showPassword, setShowPassword,
    loading, error,
    handleSubmit
  } = useLogin();

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="login-hero-overlay" />
        <div className="login-hero-content">
          <div className="login-hero-brand">
            <img src={logo} alt="DungCafe" className="login-hero-logo" />
            <div>
              <h1 className="login-hero-brand-name">DungCafe</h1>
              <p className="login-hero-brand-tag">Coffee Management System</p>
            </div>
          </div>

          <h2 className="login-hero-title">
            Quản lý quán cà phê<br />
            <span>thông minh & hiện đại</span>
          </h2>
          <p className="login-hero-description">
            Theo dõi đơn hàng theo thời gian thực, quản lý kho nguyên liệu tự động,
            và tối ưu hóa doanh thu — tất cả trong một bảng điều khiển.
          </p>

          <ul className="login-hero-features">
            <li><span className="login-hero-bullet">☕</span> Quản lý đơn hàng & bàn</li>
            <li><span className="login-hero-bullet">📊</span> Báo cáo doanh thu chi tiết</li>
            <li><span className="login-hero-bullet">📦</span> Tự động trừ kho theo công thức</li>
          </ul>
        </div>

        <div className="login-hero-shape login-hero-shape-1" />
        <div className="login-hero-shape login-hero-shape-2" />
        <div className="login-hero-shape login-hero-shape-3" />
      </section>

      <section className="login-form-shell">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-header">
            <div className="login-card-icon">
              {React.createElement(MdLocalCafe as any, { size: 32 })}
            </div>
            <h2 className="login-card-title">Chào mừng trở lại</h2>
            <p className="login-card-subtitle">Đăng nhập để vào bảng điều khiển quản trị</p>
          </div>

          <div className="login-field">
            <label htmlFor="username">Tên đăng nhập</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                {React.createElement(MdPerson as any, { size: 20 })}
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Nhập tên đăng nhập"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Mật khẩu</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                {React.createElement(MdLock as any, { size: 20 })}
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                required
              />
              <button
                className="login-toggle-password"
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                tabIndex={-1}
              >
                {React.createElement((showPassword ? MdVisibilityOff : MdVisibility) as any, { size: 20 })}
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
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          <button className="login-submit-button" type="submit" disabled={loading}>
            {loading ? (
              "Đang đăng nhập..."
            ) : (
              <>
                {React.createElement(MdLogin as any, { size: 20, style: { marginRight: 8, verticalAlign: "middle" } })}
                Đăng nhập
              </>
            )}
          </button>

          {error ? (
            <p className="login-error-message" role="alert">
              {error}
            </p>
          ) : null}

          <p className="login-card-footer">
            © {new Date().getFullYear()} DungCafe · Coffee Management
          </p>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
