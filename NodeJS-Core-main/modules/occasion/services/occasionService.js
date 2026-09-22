const { Occasion, OccasionTranslation } = require("models");

const occasionService = {
  list: async (lang = "vi") => {
    return await Occasion.findAll({
      where: { is_active: true },
      include: [
        {
          model: OccasionTranslation,
          as: "translations",
          where: { language_code: lang },
          required: false,
        },
      ],
    });
  },

  getById: async (id, lang = "vi") => {
    return await Occasion.findByPk(id, {
      include: [
        {
          model: OccasionTranslation,
          as: "translations",
          where: { language_code: lang },
          required: false,
        },
      ],
    });
  },

  create: async (data) => {
    const occasion = await Occasion.create({
      slug: data.slug,
      fixed_date: data.fixed_date || null,
      is_recurring: data.is_recurring !== undefined ? data.is_recurring : true,
      is_active: data.is_active !== undefined ? data.is_active : true,
    });

    if (data.name) {
      await OccasionTranslation.create({
        occasion_id: occasion.id,
        language_code: data.language_code || "vi",
        name: data.name,
        description: data.description || "",
      });
    }

    return occasionService.getById(occasion.id, data.language_code || "vi");
  },

  update: async (id, data) => {
    const occasion = await Occasion.findByPk(id);
    if (!occasion) {
      const error = new Error("Occasion not found");
      error.statusCode = 404;
      throw error;
    }

    await occasion.update(data);

    if (data.name) {
      const [translation] = await OccasionTranslation.findOrCreate({
        where: { occasion_id: id, language_code: data.language_code || "vi" },
        defaults: { name: data.name, description: data.description || "" },
      });
      await translation.update({
        name: data.name,
        description: data.description !== undefined ? data.description : translation.description,
      });
    }

    return occasionService.getById(id, data.language_code || "vi");
  },

  delete: async (id) => {
    const occasion = await Occasion.findByPk(id);
    if (!occasion) {
      const error = new Error("Occasion not found");
      error.statusCode = 404;
      throw error;
    }
    await OccasionTranslation.destroy({ where: { occasion_id: id } });
    await occasion.destroy();
    return true;
  },
};

module.exports = occasionService;
