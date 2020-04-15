module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define(
    'Transactions',
    {
      blockNumber: DataTypes.BIGINT,
      recipient: DataTypes.STRING,
      profit: DataTypes.DECIMAL(50),
    },
    {}
  );
  return Transactions;
};
