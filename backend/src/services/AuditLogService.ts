





import prisma from '../lib/prisma';
import { AppError } from '../shared/errors';

interface CreateAuditLogDTO {
    userId: string;
    action: string;
    correlationId?: string;
    details: object;
}

export class AuditLogService {

    async log({ userId, action, correlationId, details }: CreateAuditLogDTO) {
        const log = await prisma.auditLog.create({
            data: {
                userId,
                action,
                correlationId,
                details
            }
        });

        return log;
    }

    async listAll() {
        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, role: true } }
            }
        });

        if (logs.length === 0) {
            throw new AppError("Nenhum log encontrado", 404);
        }

        return { data: logs, message: "Logs listados com sucesso" };
    }

    async listByUser(userId: string) {
        const logs = await prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, role: true } }
            }
        });

        if (logs.length === 0) {
            throw new AppError("Nenhum log encontrado para este usuário", 404);
        }

        return { data: logs, message: "Logs do usuário listados com sucesso" };
    }

    async listByCorrelation(correlationId: string) {
        const logs = await prisma.auditLog.findMany({
            where: { correlationId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: { select: { id: true, name: true, role: true } }
            }
        });

        if (logs.length === 0) {
            throw new AppError("Nenhum log encontrado para esta operação", 404);
        }

        return { data: logs, message: "Logs da operação listados com sucesso" };
    }
}