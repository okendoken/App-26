const db = require('../db/models');
const Promo_codesDBApi = require('../db/api/promo_codes');

module.exports = class Promo_codesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await Promo_codesDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let promo_codes = await Promo_codesDBApi.findBy({ id }, { transaction });

      if (!promo_codes) {
        throw new ValidationError('promo_codesNotFound');
      }

      await Promo_codesDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return promo_codes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await Promo_codesDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
