import { PrismaClient } from '../../generated/prisma';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// ✅ instala: npm install -D jest-mock-extended
jest.mock('../../lib/prisma', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>()
}));

import prisma from '../../lib/prisma';

beforeEach(() => {
    mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;