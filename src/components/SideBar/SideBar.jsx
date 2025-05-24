import { Box,Settings,ShoppingCart,Archive,BarChart,LayoutDashboard} from "lucide-react";

const SideBar = () => {
    return ( <>
    
        <aside className="h-screen w-60 bg-white  p-4 space-y-2">
            <div className="flex items-center ">

                <div className="flex items-center  gap-2 text-2xl font-bold text-green-600">
                <Box className="w-6 h-6"/>
                    <span className="text-black">Bold Stock</span>
                </div>
            </div>
            <nav className="mt-6 space-y-1 text-gray-700  border-r h-screen ">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 font-semibold">
                    <LayoutDashboard className="w-5 h-5  "/>
                    Dashboard
                </div> 
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100  ">
                    <Archive className="w-5 h-5 "/>
                    Estoque
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ">
                    <BarChart className="w-5 h-5 "/>
                    Relatorios
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ">
                    <ShoppingCart className="w-5 h-5 "/>
                    Vendas
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ">
                    <Box className="w-5 h-5 "/>
                    Produtos
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 ">
                    <Settings className="w-5 h-5 "/>
                    Configuracoes
                </div>
            </nav>
        </aside>
    
    </> );
}
 
export default SideBar;