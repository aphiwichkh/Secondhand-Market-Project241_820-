import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Layout() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Secondhand Marketplace</p>
          <h1 className="brand-title">Buy, sell, and manage used items cleanly.</h1>
        </div>

        <div className="topbar-actions">
          {user ? <span className="user-chip">{user.username}</span> : null}
          {!isAuthenticated ? (
            <>
              <NavLink className="ghost-button auth-link-button" to="/login">
                เข้าสู่ระบบ / Login
              </NavLink>
              <NavLink className="primary-button auth-link-button" to="/register">
                สมัครสมาชิก / Register
              </NavLink>
            </>
          ) : null}
          {isAuthenticated ? (
            <button className="ghost-button" onClick={logout} type="button">
              ออกจากระบบ / Logout
            </button>
          ) : null}
        </div>
      </header>

      <nav className="nav-tabs">
        <NavLink
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          to="/"
        >
          สินค้า / Products
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          to="/chat"
        >
          แชท / Chat
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          to="/add-product"
        >
          เพิ่มสินค้า / Add Product
        </NavLink>
      </nav>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
