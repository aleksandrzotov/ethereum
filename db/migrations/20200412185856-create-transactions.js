module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      blocksNumber: Sequelize.INTEGER,
      recipient: Sequelize.STRING,
      profit: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    }),
  down: queryInterface => queryInterface.dropTable('Transactions'),
};
