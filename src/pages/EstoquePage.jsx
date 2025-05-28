

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card.jsx';

const EstoquePage = () => {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Página de Estoque</h1>
            <p className="text-muted-foreground">Aqui você poderá gerenciar seus produtos em estoque.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral do Estoque</CardTitle>
                    <CardDescription>Esta é uma página de placeholder para o seu gerenciamento de estoque.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Conteúdo da página de estoque será adicionado aqui.</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Você pode começar a adicionar tabelas de produtos, filtros e outras funcionalidades aqui.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default EstoquePage;
