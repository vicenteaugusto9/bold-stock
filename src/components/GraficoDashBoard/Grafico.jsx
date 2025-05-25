import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
}
from "recharts"

const dados =[
        {nome: 'jan', vendas: 400},
        {nome: 'Fev', vendas: 150},
        {nome: 'Mar', vendas: 550},
        {nome: 'Abr', vendas: 1200},
        {nome: 'Mai', vendas: 700},
        {nome: 'Jun', vendas: 900},
    ]

const GraficoDashBoard = () => {

    return ( <>
    
        <div className=" flex flex-col items-center justify-center gap-1.5 max-w-full h-64 p-4 bg-neutral-900 rounded-2xl shadow-md">
            <h2 className=" text-blue-700 flex items-center justify-center text-2xl font-semibold">Vendas Mensais</h2>
            <ResponsiveContainer>
                <LineChart data={dados}>
                    <CartesianGrid strokeDasharray="3 3"
                    stroke="oklch(37% 0.013 285.805)" />
                    <XAxis dataKey="nome"
                    stroke="oklch(48.8% 0.243 264.376)" />
                     <YAxis 
                     stroke="oklch(48.8% 0.243 264.376)" />
                     <Tooltip 
                     contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff',
                         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                         borderRadius: '8px'
                      }}
                     labelStyle={{ color: '#93c5fd'       
                     }}
                     />
                     <Line type="monotone" dataKey="vendas" stroke="oklch(45.9% 0.187 3.815)" strokeWidth={3} />
                </LineChart>


            </ResponsiveContainer>
        </div>
    
    </> );
}
 
export default GraficoDashBoard;