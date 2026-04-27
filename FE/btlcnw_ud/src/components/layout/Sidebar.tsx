import React, { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  MdAccountBalanceWallet,
  MdAccountCircle,
  MdBarChart,
  MdDashboard,
  MdExpandLess,
  MdExpandMore,
  MdHistory,
  MdInventory,
  MdLocalCafe,
  MdLocalShipping,
  MdLogout,
  MdManageAccounts,
  MdMenuBook,
  MdPeople,
  MdReceiptLong,
  MdRestaurantMenu,
  MdSettings,
  MdStorefront,
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

interface NavGroup {
  id: string;
  label: string;
  icon: any;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

const isGroup = (entry: NavEntry): entry is NavGroup =>
  (entry as NavGroup).children !== undefined;

const navEntries: NavEntry[] = [
  // Tổng quan
  { label: "Bảng điều khiển", icon: MdDashboard, to: "/dashboard" },

  // Vận hành
  {
    id: "operations",
    label: "Vận hành",
    icon: MdRestaurantMenu,
    children: [
      { label: "Đơn hàng", icon: MdReceiptLong, to: "/orders" },
      { label: "Bàn", icon: MdTableRestaurant, to: "/tables" },
      { label: "Thực đơn", icon: MdLocalCafe, to: "/menu" },
      { label: "Công thức món", icon: MdMenuBook, to: "/recipes", roles: ["quản lý"] }
    ]
  },

  // Kho & cung ứng
  {
    id: "warehouse",
    label: "Kho & cung ứng",
    icon: MdStorefront,
    children: [
      { label: "Kho nguyên liệu", icon: MdInventory, to: "/inventory", roles: ["quản lý"] },
      { label: "Nhà cung cấp", icon: MdLocalShipping, to: "/suppliers", roles: ["quản lý"] }
    ]
  },

  // Nhân sự
  {
    id: "personnel",
    label: "Nhân sự",
    icon: MdPeople,
    children: [
      { label: "Nhân viên", icon: MdPeople, to: "/employees", roles: ["quản lý"] },
      { label: "Tài khoản", icon: MdManageAccounts, to: "/users", roles: ["quản lý"] }
    ]
  },

  // Tài chính & báo cáo
  {
    id: "finance",
    label: "Tài chính & báo cáo",
    icon: MdAccountBalanceWallet,
    children: [
      { label: "Lịch sử thanh toán", icon: MdHistory, to: "/payments" },
      { label: "Báo cáo", icon: MdBarChart, to: "/reports" }
    ]
  }
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
  const location = useLocation();
  const { username, setUsername } = useAppContext();
  const role = getCurrentUserRole();

  const visibleEntries = useMemo(() => {
    return navEntries
      .map((entry) => {
        if (isGroup(entry)) {
          const filteredChildren = entry.children.filter(
            (child) => !child.roles || child.roles.includes(role)
          );
          if (filteredChildren.length === 0) return null;
          return { ...entry, children: filteredChildren } as NavGroup;
        }
        if (!entry.roles || entry.roles.includes(role)) return entry;
        return null;
      })
      .filter((entry): entry is NavEntry => entry !== null);
  }, [role]);

  const initialOpenGroups = useMemo(() => {
    const open: Record<string, boolean> = {};
    visibleEntries.forEach((entry) => {
      if (isGroup(entry)) {
        open[entry.id] = entry.children.some(
          (child) => location.pathname.startsWith(child.to)
        );
      }
    });
    return open;
  }, [visibleEntries, location.pathname]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpenGroups);

  const toggleGroup = (id: string) => {
    setOpenGroups((previous) => ({ ...previous, [id]: !previous[id] }));
  };

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
        {visibleEntries.map((entry) => {
          if (isGroup(entry)) {
            const isOpen = openGroups[entry.id] ?? initialOpenGroups[entry.id] ?? false;
            const hasActiveChild = entry.children.some(
              (child) => location.pathname.startsWith(child.to)
            );
            return (
              <div key={entry.id} className="sidebar-group">
                <button
                  type="button"
                  className={
                    hasActiveChild
                      ? "sidebar-group-toggle sidebar-group-toggle-active"
                      : "sidebar-group-toggle"
                  }
                  onClick={() => toggleGroup(entry.id)}
                  aria-expanded={isOpen}
                >
                  {React.createElement(entry.icon as any, { size: 20 })}
                  <span className="sidebar-group-label">{entry.label}</span>
                  {React.createElement((isOpen ? MdExpandLess : MdExpandMore) as any, {
                    size: 20,
                    className: "sidebar-group-chevron"
                  })}
                </button>
                {isOpen ? (
                  <div className="sidebar-group-children">
                    {entry.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          isActive
                            ? "sidebar-link sidebar-sublink sidebar-link-active"
                            : "sidebar-link sidebar-sublink"
                        }
                      >
                        {React.createElement(child.icon as any, { size: 18 })}
                        <span>{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }

          return (
            <NavLink
              key={entry.to}
              to={entry.to}
              className={({ isActive }) =>
                isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
              }
            >
              {React.createElement(entry.icon as any, { size: 20 })}
              <span>{entry.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          {React.createElement(MdAccountCircle as any, { size: 28 })}
          <span className="sidebar-user-name">{username}</span>
          <button
            type="button"
            className="sidebar-settings-btn"
            onClick={() => navigate("/profile")}
            aria-label="Cài đặt / Hồ sơ cá nhân"
            title="Cài đặt"
          >
            {React.createElement(MdSettings as any, { size: 20 })}
          </button>
        </div>
        <button className="sidebar-signout" type="button" onClick={handleSignOut}>
          {React.createElement(MdLogout as any, { size: 18 })}
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
