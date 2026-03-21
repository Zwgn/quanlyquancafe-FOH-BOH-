import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../../assets/styles/app-layout.css";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Header />
        <section className="app-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AppLayout;
