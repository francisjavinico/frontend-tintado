import { Outlet } from "react-router-dom";
import SidebarWithHeader from "../components/layout/SideBar";

export default function AdminLayout() {
  return (
    <SidebarWithHeader>
      <Outlet />
    </SidebarWithHeader>
  );
}
