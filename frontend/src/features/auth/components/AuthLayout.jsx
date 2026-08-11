import "../styles/AuthLayout.css";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{title}</h1>

          {subtitle && <p>{subtitle}</p>}
        </div>

        <div className="auth-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;