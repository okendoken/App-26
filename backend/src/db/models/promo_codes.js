const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const promo_codes = sequelize.define(
    'promo_codes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      code: {
        type: DataTypes.TEXT,
      },

      discount: {
        type: DataTypes.DECIMAL,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  promo_codes.associate = (db) => {
    db.promo_codes.belongsToMany(db.products, {
      as: 'products',
      foreignKey: {
        name: 'promo_codes_productsId',
      },
      constraints: false,
      through: 'promo_codesProductsProducts',
    });

    db.promo_codes.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.promo_codes.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return promo_codes;
};
