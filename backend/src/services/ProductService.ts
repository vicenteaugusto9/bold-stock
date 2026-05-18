import prisma from "../lib/prisma";

interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    stock: number;
}