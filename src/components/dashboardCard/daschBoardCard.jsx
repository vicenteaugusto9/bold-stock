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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DashBoardCard = () => {
    const [produtosStockItems, setProdutosStockItems] = useState([]);
    const [vendasData, setVendasDatas] = useState({ total: 0, change: 0 });
    const [inventarioStock, setInventarioStock] = useState({
        total: 0,
        change: 0,
    });
    const [receitaStock, setReceitaStock] = useState({ total: 0, change: 0 });

    useEffect(() => {
        setProdutosStockItems([
            { id: 1, nome: "Camisa Lacoste", estoque: 15, minestoque: 10 },
            { id: 2, nome: "Bermuda Bransk", estoque: 18, minestoque: 10 },
            { id: 3, nome: "Calca MR2", estoque: 23, minestoque: 10 },
        ]);
        setVendasDatas({ total: 159, change: 12.5 });
        setInventarioStock({ total: 435, change: -3.5 });
        setReceitaStock({ total: 24650, change: 8.7 });
    }, []);

    return (
        <div className="dashboard-wrap">
            <div>
                <h1 className="page-title">Dashboard</h1>
                <p className="page-description">Visão geral do seu negócio</p>
            </div>
            <div className="dashboard-grid dashboard-grid-3">
                <Card>
                    <CardHeader className="stats-card-header">
                        <CardTitle className="stats-card-title">Vendas Totais</CardTitle>
                        <ShoppingCart className="icon-small muted-text" />
                    </CardHeader>

                    <CardContent>
                        <div className="stats-card-value">{vendasData.total}</div>
                        <div className={vendasData.change > 0 ? "stats-card-meta change-positive" : "stats-card-meta change-negative"}>
                            {vendasData.change > 0 ? (
                                <>
                                    <TrendingUp className="icon-small" />
                                    <span>{vendasData.change}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="icon-small" />
                                    <span>{Math.abs(vendasData.change)}%</span>
                                </>
                            )}
                            <span className="ml-1">em relação ao mês anterior</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="stats-card-header">
                        <CardTitle className="stats-card-title">Produtos em estoque</CardTitle>
                        <Package className="icon-small muted-text" />
                    </CardHeader>
                    <CardContent>
                        <div className="stats-card-value">{inventarioStock.total}</div>
                        <div className={inventarioStock.change > 0 ? "stats-card-meta change-positive" : "stats-card-meta change-negative"}>
                            {inventarioStock.change > 0 ? (
                                <>
                                    <TrendingUp className="icon-small" />
                                    <span>{inventarioStock.change}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="icon-small" />
                                    <span>{Math.abs(inventarioStock.change)}%</span>
                                </>
                            )}
                            <span className="ml-1">em relação ao mês anterior</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="stats-card-header">
                        <CardTitle className="stats-card-title">Receita Total</CardTitle>
                        <DollarSign className="icon-small muted-text" />
                    </CardHeader>
                    <CardContent>
                        <div className="stats-card-value">R$ {receitaStock.total.toLocaleString("pt-BR")}</div>
                        <div className={receitaStock.change > 0 ? "stats-card-meta change-positive" : "stats-card-meta change-negative"}>
                            {receitaStock.change > 0 ? (
                                <>
                                    <TrendingUp className="icon-small" />
                                    <span>{receitaStock.change}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="icon-small" />
                                    <span>{Math.abs(receitaStock.change)}%</span>
                                </>
                            )}
                            <span className="ml-1">em relação ao mês anterior</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="alerts-section">
                <div className="alerts-header">
                    <h2 className="alerts-title">Alertas de Estoque Baixo</h2>
                    <Button variant="outline" size="sm" asChild>
                        <Link to="/estoque">
                            Ver todos
                            <ArrowRight className="icon-small icon-spaced" />
                        </Link>
                    </Button>
                </div>
                {produtosStockItems.length < 10 ? (
                    <div className="alerts-grid alerts-grid-3">
                        {produtosStockItems.map((item) => (
                            <Alert
                                key={item.id}
                                variant="destructive"
                                className="alert-card"
                            >
                                <AlertCircle className="icon-small" />
                                <AlertTitle className="text-red-600">{item.nome}</AlertTitle>
                                <AlertDescription className="mt-2">
                                    <div className="text-sm text-red-600">
                                        Estoque atual: <span className="font-bold">{item.estoque}</span> de {item.minestoque} mínimo
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
                        <AlertCircle className="icon-small" />
                        <AlertTitle>Tudo em ordem!</AlertTitle>
                        <AlertDescription>
                            Não há produtos com estoque abaixo do mínimo no momento
                        </AlertDescription>
                    </Alert>
                )}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Vendas Recentes</CardTitle>
                    <CardDescription>Análise de vendas dos últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="empty-chart">
                        <div className="empty-chart-inner">
                            <BarChart3 className="h-8 w-8" />
                            <span>Gráfico de Vendas</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" size="sm" className="button-right">
                        Ver relatório completo
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default DashBoardCard;
