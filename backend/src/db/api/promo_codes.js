const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Promo_codesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const promo_codes = await db.promo_codes.create(
      {
        id: data.id || undefined,

        code: data.code || null,
        discount: data.discount || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await promo_codes.setProducts(data.products || [], {
      transaction,
    });

    return promo_codes;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const promo_codes = await db.promo_codes.findByPk(id, {
      transaction,
    });

    await promo_codes.update(
      {
        code: data.code || null,
        discount: data.discount || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await promo_codes.setProducts(data.products || [], {
      transaction,
    });

    return promo_codes;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const promo_codes = await db.promo_codes.findByPk(id, options);

    await promo_codes.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await promo_codes.destroy({
      transaction,
    });

    return promo_codes;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const promo_codes = await db.promo_codes.findOne(
      { where },
      { transaction },
    );

    if (!promo_codes) {
      return promo_codes;
    }

    const output = promo_codes.get({ plain: true });

    output.products = await promo_codes.getProducts({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.products,
        as: 'products',
        through: filter.products
          ? {
              where: {
                [Op.or]: filter.products.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.products ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.code) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('promo_codes', 'code', filter.code),
        };
      }

      if (filter.discountRange) {
        const [start, end] = filter.discountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            discount: {
              ...where.discount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            discount: {
              ...where.discount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = await db.promo_codes.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction,
    });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('promo_codes', 'code', query),
        ],
      };
    }

    const records = await db.promo_codes.findAll({
      attributes: ['id', 'code'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['code', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.code,
    }));
  }
};
