import {Icons} from "../../constants/icons.js"

const DashBoardCard = ({titleCard,vendasTotal}) => {
    return (   <>
    
        <div className="flex max-w-60 h-24 bg-blue-600 items-center justify-center tracking-wide font-semibold  rounded-md  text-white ">

            <div className="  flex flex-col items-center justify-center gap-6">
                <h4 className=" font-semibold">
                    {titleCard}
                </h4>

                <p className="text-2xl"> R$ {vendasTotal}</p>

            </div>


        </div>
    
        </> );
}
 
export default DashBoardCard;