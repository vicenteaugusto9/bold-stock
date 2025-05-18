import { Icons } from "../../constants/icons";


const Header = ({logo,iconInstagram,iconLinkedin,iconGithub}) => {
    return ( 

        <>
            <div className="flex border-b-blue-500 rounded-sm p-3  items-center  justify-evenly font-sans " >

                <div className="flex align-center items-center gap-1.5">

                <img src={logo} alt="Logo Bold Stock" className="w-6 h-6  rounded-sm  "/>
                    <p  className=" flex gap-1.5 text-sm  tracking-tighter text-orange-400 font-bold"> <p className="text-blue-900 text-sm tracking-tight" > Bold </p> Stock</p>
                </div>

                <div className="flex gap-1.5">
                    <img src={iconGithub} alt="Github" className="w-6 h-6"  />
                    <img src={iconInstagram} alt="instagram"  className="w-6 h-6"/>
                    <img src={iconLinkedin} alt="Linkedin" className="w-6 h-6" />
                </div>



            </div>
        
        
        </>
     );
}
 
export default Header;