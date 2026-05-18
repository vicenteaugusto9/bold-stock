import prisma from "../lib/prisma";

interface CreateCategoryDTO {
  name: string;
}

export class CategoryService {
  // Método para criar uma nova categoria
  async createCategory({ name }: CreateCategoryDTO) {
    const categoryAlreadyExists = await prisma.category.findUnique({
      where: {
        name,
      },
    });
    if (categoryAlreadyExists) {
      throw new Error("Categoria já existente no sistema.");
    }
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    return { data: category, message: "Categoria criada com sucesso!" };
  }
  async listAllCategories() {
    // Método para listar todas as categorias
    const category = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });
    if (category.length === 0) {
      throw new Error("Nenhuma categoria encontrada.");
    }
    return { data: category, message: "Categorias listadas com sucesso!" };
  }

  async updateCategory(id: string, name: string) {
    // Método para atualizar uma categoria existente
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }
    const uptadeCategory = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return {
      data: uptadeCategory,
      message: "Categoria atualizada com sucesso!",
    };
  }

  async deleteCategory(id: string) {
    // Método para deletar uma categoria
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }
    if (category._count.products > 0) {
      throw new Error(
        "Não é possível deletar uma categoria que possui produtos associados.",
      );
    }
    await prisma.category.delete({
      where: {
        id,
      },
    });
    return { data: category, message: "Categoria deletada com sucesso!" };
  }
}
