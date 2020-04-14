module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define(
    'Transactions',
    {
      blocksNumber: DataTypes.INTEGER,
      recipient: DataTypes.STRING,
      profit: DataTypes.STRING,
    },
    {}
  );
  return Transactions;
};
