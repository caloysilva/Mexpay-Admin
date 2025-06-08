const db = require('../models');
const Users = db.users;

const Billers = db.billers;

const Transactions = db.transactions;

const BillersData = [
  {
    name: 'Utility Corp',

    service_type: 'Electricity',

    // type code here for "relation_many" field
  },

  {
    name: 'Water Works',

    service_type: 'Water',

    // type code here for "relation_many" field
  },

  {
    name: 'Gas Supply Co',

    service_type: 'Gas',

    // type code here for "relation_many" field
  },
];

const TransactionsData = [
  {
    amount: 150.75,

    transaction_date: new Date('2023-10-01T10:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    amount: 200,

    transaction_date: new Date('2023-10-02T11:30:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    amount: 50.25,

    transaction_date: new Date('2023-10-03T09:15:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

// Similar logic for "relation_many"

// Similar logic for "relation_many"

async function associateTransactionWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Transaction0 = await Transactions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Transaction0?.setUser) {
    await Transaction0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Transaction1 = await Transactions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Transaction1?.setUser) {
    await Transaction1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Transaction2 = await Transactions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Transaction2?.setUser) {
    await Transaction2.setUser(relatedUser2);
  }
}

async function associateTransactionWithBiller() {
  const relatedBiller0 = await Billers.findOne({
    offset: Math.floor(Math.random() * (await Billers.count())),
  });
  const Transaction0 = await Transactions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Transaction0?.setBiller) {
    await Transaction0.setBiller(relatedBiller0);
  }

  const relatedBiller1 = await Billers.findOne({
    offset: Math.floor(Math.random() * (await Billers.count())),
  });
  const Transaction1 = await Transactions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Transaction1?.setBiller) {
    await Transaction1.setBiller(relatedBiller1);
  }

  const relatedBiller2 = await Billers.findOne({
    offset: Math.floor(Math.random() * (await Billers.count())),
  });
  const Transaction2 = await Transactions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Transaction2?.setBiller) {
    await Transaction2.setBiller(relatedBiller2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Billers.bulkCreate(BillersData);

    await Transactions.bulkCreate(TransactionsData);

    await Promise.all([
      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      await associateTransactionWithUser(),

      await associateTransactionWithBiller(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('billers', null, {});

    await queryInterface.bulkDelete('transactions', null, {});
  },
};
