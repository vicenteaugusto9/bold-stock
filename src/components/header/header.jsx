import { Icons } from "../../constants/icons";
import { User,ArrowDown,ChevronDown} from "lucide-react";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";


const Header = ({users}) => {
    return ( 

        <>
        <div className="flex  justify-end items-center pr-10 p-2">
            <div className="flex items-center justify-end border gap-2 p-2 rounded-lg w-60 " >
                <User className="w-5 h-5"/>
                <p>{users}</p>
                <ChevronDown className="w-5 h-5"/>
            </div>
        </div>

        
        
        </>
     );
}
 
export default Header;