import { Icons } from "../../constants/icons";


const Header = ({logo,iconInstagram,iconLinkedin,iconGithub}) => {
    return ( 

        <>
            <div className="flex border-b-blue-500 rounded-sm p-3 bg-gray-50  items-center  justify-evenly flex-wrap " >

                
                <div className="flex align-center items-center gap-1.5">

                <img src={logo} alt="Logo Bold Stock" className="w-12 h-12  rounded-sm  "/>
                    <p  className=" flex gap-1.5 text-sm  tracking-tighter text-orange-400 font-bold"> <p className="text-blue-900 text-sm tracking-tight font-bold" > Bold </p> Stock</p>
                </div>
                <div className="title">
                    <h1 className=" tracking-wider text-4xl font-bold text-blue-900 ">
                        DashBoard
                    </h1>
                </div>

                <div className="flex gap-1.5">
                    <img src={iconGithub} alt="Github" className="w-5 h-5 hover:scale-110 transition-transform duration-200 "  />
                    <img src={iconInstagram} alt="instagram"  className="w-5 h-5 hover:scale-110 transition-transform duration-200"/>
                    <img src={iconLinkedin} alt="Linkedin" className="w-5 h-5 hover:scale-110 transition-transform duration-200z    " />
                </div>



            </div>
        
        
        </>
     );
}
 
export default Header;