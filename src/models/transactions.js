module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define(
    'Transactions',
    {
      blocksNumber: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      recipient: DataTypes.STRING,
      profit: DataTypes.INTEGER,
    },
    {}
  );
  return Transactions;
};
