module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      blockNumber: Sequelize.BIGINT,
      recipient: Sequelize.STRING,
      profit: Sequelize.DECIMAL(50),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    }),
  down: queryInterface => queryInterface.dropTable('Transactions'),
};
