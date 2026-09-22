module.exports = async () => {
    const sequelize = global.__SEQUELIZE__;

    if (sequelize) {
        try {
            await sequelize.close();
        } catch (error) {
            console.error(error);
        }
    }
};