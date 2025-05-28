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

import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    CardFooter,
    CardHeader,
} from "../ui/card.jsx";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert.jsx";
import { Button } from "../ui/button.jsx";
import { Progress } from "../ui/progress.jsx";
import { useEffect, useState,} from "react";
import { Link } from "react-router-dom";

const DashBoardCard = ({}) => {
    const [produtosStockItems, setProdutosStockItems] = useState([]);
    const [vendasData, setVendasDatas] = useState({ total: 0, change: 0 });
    const [inventarioStock, setInventarioStock] = useState({
        total: 0,
        change: 0,
    });
    const [receitaStock, setReceitaStock] = useState({ total: 0, change: 0 });

    useEffect(() => {
        //Dados ficticios

        setProdutosStockItems([
            { id: 1, nome: "Camisa Lacoste", estoque: 5, minestoque: 10 },
            { id: 2, nome: "Bermuda Bransk", estoque: 8, minestoque: 10 },
            { id: 3, nome: "Calca MR2", estoque: 23, minestoque: 10 },
        ]);
        setVendasDatas({ total: 159, change: 12.5 });
        setInventarioStock({ total: 435, change: -3.5 });
        setReceitaStock({ total: 24650, change: 8.7 });
    }, []);
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral do seu negócio</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Vendas Totais
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>

                    <CardContent>
                        <div className="text-2xl font-bold">{vendasData.total}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            {vendasData.change > 0 ? (
                                <>
                                    <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                                    <span className="text-emerald-500">
                                        {vendasData.change}%
                                    </span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                                    <span className="text-red-500">
                                        {Math.abs(vendasData.change)}%
                                    </span>
                                </>
                            )}
                            <span className="ml-1">em relação ao mês anterior</span>
                        </div>

                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Produtos em estoque
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventarioStock.total}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            {inventarioStock.change > 0 ? (
                                <>
                                    <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                                    <span className="text-emerald-500">
                                        {inventarioStock.change}%
                                    </span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                                    <span className="text-red-500">
                                        {Math.abs(inventarioStock.change)}%
                                    </span>
                                </>
                            )}
                            <span className="ml-1">em relação ao mês anterior</span>
                        </div>

                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Receita Total
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            R$ {receitaStock.total.toLocaleString("pt-BR")}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            {receitaStock.change > 0 ? (
                                <>
                                    <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                                    <span className="text-emerald-500">
                                        {receitaStock.change}%
                                    </span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                                    <span className="text-red-500">
                                        {Math.abs(receitaStock.change)}%
                                    </span>
                                </>
                            )}
                            <span className="ml-1">em relação ao mês anterior</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Alertas de Estoque Baixo</h2>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/estoque">
                            Ver todos
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                {produtosStockItems.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {produtosStockItems.map((item) => (
                            <Alert
                                key={item.id}
                                variant="destructive"
                                className="border-red-200 bg-red-50"
                            >
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <AlertTitle className="text-red-600">{item.nome}</AlertTitle>
                                <AlertDescription className="mt-2">
                                    <div className="text-sm text-red-600">
                                        Estoque atual:{" "}
                                        <span className="font-bold">{item.estoque}</span> de{" "}
                                     
                                        {item.minestoque} mínimo
                                    </div>
                                    <Progress
                                        
                                        value={(item.estoque / item.minestoque) * 100}
                                        className="mt-2 bg-red-200"
                                        indicatorClassName="bg-red-600"
                                    />
                                </AlertDescription>
                            </Alert>
                        ))}
                    </div>
                ) : (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Tudo em ordem!</AlertTitle>
                        <AlertDescription>
                            Não há produtos com estoque abaixo do mínimo no momento
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            {
                <Card>
                    <CardHeader>
                        <CardTitle>Vendas Recentes</CardTitle>
                        <CardDescription>
                            Análise de vendas dos últimos 30 dias
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full rounded-md border border-dashed flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <BarChart3 className="h-8 w-8" />
                                <span>Grafico de Vendas </span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" size="sm" className="ml-auto">
                            Ver relatório completo
                        </Button>
                    </CardFooter>
                </Card>
            }
        </div>
    );
};

export default DashBoardCard;
