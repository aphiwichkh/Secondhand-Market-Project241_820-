import { Link, Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-stage">
        <section className="auth-hero">
          <p className="eyebrow">ตลาดมือสอง / Secondhand Marketplace</p>
          <h1 className="auth-title">ลงชื่อเข้าใช้ก่อน แล้วกลับไปยังหน้าสินค้าได้ทันที / Login first, then go to products.</h1>
          <p className="muted">
            ลงทะเบียนหรือเข้าสู่ระบบก่อน เพื่อจัดการสินค้าได้ง่ายในระบบของคุณ / Sign in or register to manage your listings.
          </p>
          <Link className="ghost-button auth-back-link" to="/">
            กลับสู่ตลาด / Back to marketplace
          </Link>
        </section>

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
