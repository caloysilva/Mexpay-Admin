const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const billers = sequelize.define(
    'billers',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      service_type: {
        type: DataTypes.TEXT,
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

  billers.associate = (db) => {
    db.billers.belongsToMany(db.transactions, {
      as: 'transactions',
      foreignKey: {
        name: 'billers_transactionsId',
      },
      constraints: false,
      through: 'billersTransactionsTransactions',
    });

    db.billers.belongsToMany(db.transactions, {
      as: 'transactions_filter',
      foreignKey: {
        name: 'billers_transactionsId',
      },
      constraints: false,
      through: 'billersTransactionsTransactions',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.billers.hasMany(db.transactions, {
      as: 'transactions_biller',
      foreignKey: {
        name: 'billerId',
      },
      constraints: false,
    });

    //end loop

    db.billers.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.billers.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return billers;
};
