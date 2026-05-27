import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { LogOut,User,Settings } from "lucide-react";
import { Button } from "../ui/button";


const UserMenu = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <User className="icon-small" />
                    <span>Administrador</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="dropdown-content" side="button" align="end">
                <DropdownMenuLabel className="dropdown-label">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="dropdown-item">
                    <User className="icon-small" />
                    Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="dropdown-item">
                    <Settings className="icon-small" />
                    Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="dropdown-item dropdown-item-destructive">
                    <LogOut className="icon-small" />
                    Sair
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserMenu;