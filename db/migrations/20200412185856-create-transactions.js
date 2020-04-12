module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      blocksNumber: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      recipient: Sequelize.STRING,
      profit: Sequelize.INTEGER,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: queryInterface => queryInterface.dropTable('Transactions'),
};
