import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';

// ✅ sem jest.mock aqui — o mock fica em cada arquivo de teste
const prismaMock = mockDeep<PrismaClient>();
export default prismaMock;