import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Flow ERP API',
            version: '1.0.0',
            description: 'Documentação completa da API do Flow ERP'
        },
       servers: [
    { 
        url: 'https://flow-api-4xg1.onrender.com/api/v1', 
        description: 'Produção' 
    },
    { 
        url: 'http://localhost:3000/api/v1', 
        description: 'Desenvolvimento' 
    }
],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Mensagem de erro' }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/docs/routes/*.yml']
};

export const swaggerSpec = swaggerJsdoc(options);