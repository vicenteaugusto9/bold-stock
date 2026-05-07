import { Box, Settings, ShoppingCart, Archive, BarChart, LayoutDashboard } from "lucide-react";

const SideBar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <Box className="sidebar-icon" />
                <span>Bold Stock</span>
            </div>
            <nav className="sidebar-nav">
                <div className="sidebar-link sidebar-link-active">
                    <LayoutDashboard className="sidebar-icon" />
                    Dashboard
                </div>
                <div className="sidebar-link">
                    <Archive className="sidebar-icon" />
                    Estoque
                </div>
                <div className="sidebar-link">
                    <BarChart className="sidebar-icon" />
                    Relatórios
                </div>
                <div className="sidebar-link">
                    <ShoppingCart className="sidebar-icon" />
                    Vendas
                </div>
                <div className="sidebar-link">
                    <Box className="sidebar-icon" />
                    Produtos
                </div>
                <div className="sidebar-link">
                    <Settings className="sidebar-icon" />
                    Configurações
                </div>
            </nav>
        </aside>
    );
}
 
export default SideBar;