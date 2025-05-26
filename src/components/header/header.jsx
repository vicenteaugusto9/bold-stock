import { Icons } from "../../constants/icons";
import { User,ArrowDown,ChevronDown} from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import UserMenu from "../UserMenu/UserMenu";


const Header = ({users}) => {
    return ( 

        <>
        <div className="flex  justify-end items-center pr-10 p-2">
            <div className="flex items-center border gap-2  rounded-lg w-45cursor-pointer" >
               <UserMenu className="cursor-pointer"/>
            </div>
        </div>

        
        
        </>
     );
}
 
export default Header;