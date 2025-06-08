const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class BillersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const billers = await db.billers.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        service_type: data.service_type || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await billers.setTransactions(data.transactions || [], {
      transaction,
    });

    return billers;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const billersData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      service_type: item.service_type || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const billers = await db.billers.bulkCreate(billersData, { transaction });

    // For each item created, replace relation files

    return billers;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const billers = await db.billers.findByPk(id, {}, { transaction });

    const updatePayload = {};

    if (data.name !== undefined) updatePayload.name = data.name;

    if (data.service_type !== undefined)
      updatePayload.service_type = data.service_type;

    updatePayload.updatedById = currentUser.id;

    await billers.update(updatePayload, { transaction });

    if (data.transactions !== undefined) {
      await billers.setTransactions(data.transactions, { transaction });
    }

    return billers;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const billers = await db.billers.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of billers) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of billers) {
        await record.destroy({ transaction });
      }
    });

    return billers;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const billers = await db.billers.findByPk(id, options);

    await billers.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await billers.destroy({
      transaction,
    });

    return billers;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const billers = await db.billers.findOne({ where }, { transaction });

    if (!billers) {
      return billers;
    }

    const output = billers.get({ plain: true });

    output.transactions_biller = await billers.getTransactions_biller({
      transaction,
    });

    output.transactions = await billers.getTransactions({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.transactions,
        as: 'transactions',
        required: false,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('billers', 'name', filter.name),
        };
      }

      if (filter.service_type) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('billers', 'service_type', filter.service_type),
        };
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.transactions) {
        const searchTerms = filter.transactions.split('|');

        include = [
          {
            model: db.transactions,
            as: 'transactions_filter',
            required: searchTerms.length > 0,
            where:
              searchTerms.length > 0
                ? {
                    [Op.or]: [
                      {
                        id: {
                          [Op.in]: searchTerms.map((term) => Utils.uuid(term)),
                        },
                      },
                      {
                        amount: {
                          [Op.or]: searchTerms.map((term) => ({
                            [Op.iLike]: `%${term}%`,
                          })),
                        },
                      },
                    ],
                  }
                : undefined,
          },
          ...include,
        ];
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

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.billers.findAndCountAll(queryOptions);

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(query, limit, offset) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('billers', 'name', query),
        ],
      };
    }

    const records = await db.billers.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
