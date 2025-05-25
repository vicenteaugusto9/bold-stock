import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { LogOut,User,Settings } from "lucide-react";


const UserMenu = () => {
    return ( <>
    
        <DropdownMenu className="relative">
            <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2">
                    <User className="w-5 h-5"/>
                    <span className="cursor-pointer">Administrador</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className=" absolute  mt-6 w-48 rounded cursor-pointer "
            side="button"
            align="end">
                
                <DropdownMenuLabel className="text-start mb-2">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="flex gap-1 hover:bg-gray-100 rounded  cursor-pointer">
                    <User className="w-5 h-5"/>
                    Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                 <DropdownMenuItem className="flex gap-1 hover:bg-gray-100 rounded  cursor-pointer">
                    <Settings className="w-5 h-5"/>
                    Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="text-red-500 flex gap-1 hover:bg-gray-100 rounded  cursor-pointer">
                    <LogOut className="w-5 h-5"/>
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    
    </> );
}
 
export default UserMenu;