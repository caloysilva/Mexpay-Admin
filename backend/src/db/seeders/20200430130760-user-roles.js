const { v4: uuid } = require('uuid');

module.exports = {
  /**
   * @param{import("sequelize").QueryInterface} queryInterface
   * @return {Promise<void>}
   */
  async up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = new Date();

    /** @type {Map<string, string>} */
    const idMap = new Map();

    /**
     * @param {string} key
     * @return {string}
     */
    function getId(key) {
      if (idMap.has(key)) {
        return idMap.get(key);
      }
      const id = uuid();
      idMap.set(key, id);
      return id;
    }

    await queryInterface.bulkInsert('roles', [
      {
        id: getId('Administrator'),
        name: 'Administrator',
        createdAt,
        updatedAt,
      },

      {
        id: getId('system_manager'),
        name: 'system_manager',
        createdAt,
        updatedAt,
      },

      {
        id: getId('branch_leader'),
        name: 'branch_leader',
        createdAt,
        updatedAt,
      },

      {
        id: getId('financial_analyst'),
        name: 'financial_analyst',
        createdAt,
        updatedAt,
      },

      {
        id: getId('customer_service_rep'),
        name: 'customer_service_rep',
        createdAt,
        updatedAt,
      },

      {
        id: getId('data_entry_clerk'),
        name: 'data_entry_clerk',
        createdAt,
        updatedAt,
      },

      { id: getId('Public'), name: 'Public', createdAt, updatedAt },
    ]);

    /**
     * @param {string} name
     */
    function createPermissions(name) {
      return [
        {
          id: getId(`CREATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `CREATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`READ_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `READ_${name.toUpperCase()}`,
        },
        {
          id: getId(`UPDATE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `UPDATE_${name.toUpperCase()}`,
        },
        {
          id: getId(`DELETE_${name.toUpperCase()}`),
          createdAt,
          updatedAt,
          name: `DELETE_${name.toUpperCase()}`,
        },
      ];
    }

    const entities = [
      'users',
      'billers',
      'transactions',
      'roles',
      'permissions',
      ,
    ];
    await queryInterface.bulkInsert(
      'permissions',
      entities.flatMap(createPermissions),
    );
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`READ_API_DOCS`),
        createdAt,
        updatedAt,
        name: `READ_API_DOCS`,
      },
    ]);
    await queryInterface.bulkInsert('permissions', [
      {
        id: getId(`CREATE_SEARCH`),
        createdAt,
        updatedAt,
        name: `CREATE_SEARCH`,
      },
    ]);

    await queryInterface.sequelize
      .query(`create table "rolesPermissionsPermissions"
(
"createdAt"           timestamp with time zone not null,
"updatedAt"           timestamp with time zone not null,
"roles_permissionsId" uuid                     not null,
"permissionId"        uuid                     not null,
primary key ("roles_permissionsId", "permissionId")
);`);

    await queryInterface.bulkInsert('rolesPermissionsPermissions', [
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('CREATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('financial_analyst'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('financial_analyst'),
        permissionId: getId('UPDATE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('customer_service_rep'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('data_entry_clerk'),
        permissionId: getId('READ_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('CREATE_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('READ_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('UPDATE_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('DELETE_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('READ_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('UPDATE_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('DELETE_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('financial_analyst'),
        permissionId: getId('READ_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('financial_analyst'),
        permissionId: getId('UPDATE_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('customer_service_rep'),
        permissionId: getId('READ_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('data_entry_clerk'),
        permissionId: getId('READ_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('CREATE_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('READ_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('UPDATE_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('DELETE_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('READ_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('UPDATE_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('DELETE_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('financial_analyst'),
        permissionId: getId('READ_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('financial_analyst'),
        permissionId: getId('UPDATE_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('financial_analyst'),
        permissionId: getId('DELETE_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('customer_service_rep'),
        permissionId: getId('READ_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('data_entry_clerk'),
        permissionId: getId('READ_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('system_manager'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('branch_leader'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('financial_analyst'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('customer_service_rep'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('data_entry_clerk'),
        permissionId: getId('CREATE_SEARCH'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_USERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_USERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_BILLERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_BILLERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_BILLERS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_BILLERS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_TRANSACTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_TRANSACTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_TRANSACTIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_TRANSACTIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_ROLES'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_ROLES'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('UPDATE_PERMISSIONS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('DELETE_PERMISSIONS'),
      },

      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('READ_API_DOCS'),
      },
      {
        createdAt,
        updatedAt,
        roles_permissionsId: getId('Administrator'),
        permissionId: getId('CREATE_SEARCH'),
      },
    ]);

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'SuperAdmin',
      )}' WHERE "email"='super_admin@flatlogic.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'Administrator',
      )}' WHERE "email"='admin@flatlogic.com'`,
    );

    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'system_manager',
      )}' WHERE "email"='client@hello.com'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "app_roleId"='${getId(
        'branch_leader',
      )}' WHERE "email"='john@doe.com'`,
    );
  },
};
