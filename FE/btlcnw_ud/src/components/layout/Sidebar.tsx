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
import logo from "../../assets/images/logo.svg";
import "../../assets/styles/sidebar.css";

interface NavItem {
  label: string;
  icon: any;
  to: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: MdDashboard, to: "/dashboard" },
  { label: "Don hang", icon: MdReceiptLong, to: "/orders" },
  { label: "Thuc don", icon: MdLocalCafe, to: "/menu" },
  { label: "Ban", icon: MdTableRestaurant, to: "/tables" },
  { label: "Kho nguyen lieu", icon: MdInventory, to: "/inventory" },
  { label: "Nhan vien", icon: MdPeople, to: "/employees" },
  { label: "Bao cao", icon: MdBarChart, to: "/reports" }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { username } = useAppContext();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="DungCafe" className="sidebar-brand-logo" />
        <span className="sidebar-brand-name">DungCafe</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
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
