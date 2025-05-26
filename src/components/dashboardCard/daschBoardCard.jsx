import { Icons } from "../../constants/icons.js";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Card,CardContent,CardDescription,CardTitle,CardFooter,CardHeader } from "../ui/card.jsx";
import { Alert,AlertTitle,AlertDescription } from "../ui/alert.jsx";
import { Button } from "../ui/button.jsx";
import { Progress } from "../ui/progress.jsx";
import { useEffect, useState } from "react";

const DashBoardCard = ({ titleCard, vendasTotal }) => {
    const [produtosStockItems,setProdutosStockItems]= useState([])
    const [vendasData,setVendasDatas]= useState({total:0 , change:0})
    const [inventarioStock,setInventarioStock]= useState({total:0,change:0})
    const [receitaStock,setReceitaStock]= useState({total:0,change:0})


    useEffect(()=>{
        //Dadaos ficticios

        setProdutosStockItems([
            {id:1,nome:'Camisa Lacoste',estoque:30 ,minestoque:10},
            {id:2,nome:'Bermuda Bransk',estoque:50 ,minestoque:10},
            {id:3,nome:'Calca MR2',estoque:23 ,minestoque:10}
        ])
        setVendasDatas({total:159, change:12.5})
        setInventarioStock({total:435, change:-3.5})
        setReceitaStock({total:24650, change:8.7})

    },[])
  return (<>
  
    <div className="space-y-66">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>
    </div>
  
  
  
  
  </>);
};

export default DashBoardCard;
