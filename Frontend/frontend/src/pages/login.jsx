import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      await login(formData);
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card auth-card">
      <div className="stack-sm">
        <p className="eyebrow">บัญชีผู้ใช้ / Account</p>
        <h2>เข้าสู่ระบบ / Login</h2>
        <p className="muted">เข้าสู่ระบบเพื่อจัดการประกาศในตลาดของคุณ / Sign in to manage your listings.</p>
      </div>

      <form className="stack-md" onSubmit={handleSubmit}>
        <label className="field">
          <span>อีเมล / Email</span>
          <input
            className="input"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            required
            type="email"
            value={formData.email}
          />
        </label>

        <label className="field">
          <span>รหัสผ่าน / Password</span>
          <input
            className="input"
            name="password"
            onChange={handleChange}
            placeholder="รหัสผ่านของคุณ / Your password"
            required
            type="password"
            value={formData.password}
          />
        </label>

        {error ? <div className="error-banner">{error}</div> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="muted">
        ไม่มีบัญชีใช่ไหม? <Link to="/register">สร้างบัญชีใหม่ / Create account</Link>
      </p>
    </section>
  );
}

export default Login;
