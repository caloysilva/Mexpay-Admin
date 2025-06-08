const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const transactions = sequelize.define(
    'transactions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      amount: {
        type: DataTypes.DECIMAL,
      },

      transaction_date: {
        type: DataTypes.DATE,
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

  transactions.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.transactions.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.transactions.belongsTo(db.billers, {
      as: 'biller',
      foreignKey: {
        name: 'billerId',
      },
      constraints: false,
    });

    db.transactions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.transactions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return transactions;
};
