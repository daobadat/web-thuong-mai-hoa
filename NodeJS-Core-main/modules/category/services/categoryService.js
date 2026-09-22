const { Category, CategoryTranslation } = require("models");

const categoryService = {
  list: async (lang = "vi") => {
    const categories = await Category.findAll({
      where: { is_active: true },
      include: [
        {
          model: CategoryTranslation,
          as: "translations",
          where: { language_code: lang },
          required: false,
        },
      ],
      order: [["display_order", "ASC"]],
    });
    return categories;
  },

  getById: async (id, lang = "vi") => {
    const category = await Category.findByPk(id, {
      include: [
        {
          model: CategoryTranslation,
          as: "translations",
          where: { language_code: lang },
          required: false,
        },
      ],
    });
    return category;
  },

  create: async (data) => {
    const category = await Category.create({
      slug: data.slug,
      parent_id: data.parent_id || null,
      display_order: data.display_order || 0,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    if (data.name) {
      await CategoryTranslation.create({
        category_id: category.id,
        language_code: data.language_code || "vi",
        name: data.name,
        description: data.description || "",
      });
    }

    return categoryService.getById(category.id, data.language_code || "vi");
  },

  update: async (id, data) => {
    const category = await Category.findByPk(id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    await category.update(data);
    if (data.name) {
      const [translation] = await CategoryTranslation.findOrCreate({
        where: { category_id: id, language_code: data.language_code || "vi" },
        defaults: { name: data.name, description: data.description || "" },
      });
      if (translation) {
        await translation.update({
          name: data.name,
          description: data.description !== undefined ? data.description : translation.description,
        });
      }
    }

    return categoryService.getById(id, data.language_code || "vi");
  },

  delete: async (id) => {
    const category = await Category.findByPk(id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
    await CategoryTranslation.destroy({ where: { category_id: id } });
    await category.destroy();
    return true;
  },
};

module.exports = categoryService;
