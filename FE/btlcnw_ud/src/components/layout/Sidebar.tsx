import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdAccountCircle,
  MdBarChart,
  MdDashboard,
  MdInventory,
  MdLocalCafe,
  MdLogout,
  MdPeople,
  MdReceiptLong,
  MdTableRestaurant
} from "react-icons/md";
import { useAppContext } from "../../context/AppContext";
import logo from "../../assets/images/logo.png";
import "../../assets/styles/sidebar.css";

interface NavItem {
  label: string;
  icon: any;
  to: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: MdDashboard, to: "/dashboard" },
  { label: "Đơn hàng", icon: MdReceiptLong, to: "/orders" },
  { label: "Thực đơn", icon: MdLocalCafe, to: "/menu" },
  { label: "Bàn", icon: MdTableRestaurant, to: "/tables" },
  { label: "Kho nguyên liệu", icon: MdInventory, to: "/inventory", roles: ["admin"] },
  { label: "Nhân viên", icon: MdPeople, to: "/employees", roles: ["admin"] },
  { label: "Báo cáo", icon: MdBarChart, to: "/reports" }
];

const getCurrentUserRole = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return "";
  }

  try {
    const parsedUser = JSON.parse(rawUser) as { role?: string };
    return (parsedUser.role ?? "").trim().toLowerCase();
  } catch {
    return "";
  }
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { username, setUsername } = useAppContext();
  const role = getCurrentUserRole();

  const visibleNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUsername("");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="DungCafe" className="sidebar-brand-logo" />
        <span className="sidebar-brand-name">DungCafe</span>
      </div>

      <nav className="sidebar-nav">
        {visibleNavItems.map((item) => {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
              }
            >
              {React.createElement(item.icon as any, { size: 20 })}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          {React.createElement(MdAccountCircle as any, { size: 28 })}
          <span>{username}</span>
        </div>
        <button className="sidebar-signout" type="button" onClick={handleSignOut}>
          {React.createElement(MdLogout as any, { size: 18 })}
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
