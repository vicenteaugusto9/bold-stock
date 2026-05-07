

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card.jsx';

const EstoquePage = () => {
    return (
        <div className="page-shell">
            <h1 className="page-title">Página de Estoque</h1>
            <p className="page-description">Aqui você poderá gerenciar seus produtos em estoque.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Visão Geral do Estoque</CardTitle>
                    <CardDescription>Esta é uma página de placeholder para o seu gerenciamento de estoque.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Conteúdo da página de estoque será adicionado aqui.</p>
                    <p className="mt-2 text-sm muted-text">
                        Você pode começar a adicionar tabelas de produtos, filtros e outras funcionalidades aqui.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default EstoquePage;
