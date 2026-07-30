import { NavLink } from "react-router-dom";

const menuItems = [
    {
        path: "/",
        icon: "bi-speedometer2",
        label: "Dashboard",
    },
    {
        path: "/transactions",
        icon: "bi-arrow-left-right",
        label: "Transazioni",
    },
    {
        path: "/budget",
        icon: "bi-wallet2",
        label: "Budget",
    },
    {
        path: "/reports",
        icon: "bi-bar-chart",
        label: "Report",
    },
    {
        path: "/categories",
        icon: "bi-tags",
        label: "Categorie",
    },
    {
        path: "/settings",
        icon: "bi-gear",
        label: "Impostazioni",
    },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                💰 Budget App
            </div>

            <nav>

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        <i className={`bi ${item.icon}`}></i>

                        <span>{item.label}</span>

                    </NavLink>

                ))}

            </nav>

        </aside>
    );
}