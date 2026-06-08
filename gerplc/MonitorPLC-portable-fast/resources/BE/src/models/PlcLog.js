module.exports = (sequelize, DataTypes) => {

  return sequelize.define(
    "PlcLog",
    {

      username: {
        type: DataTypes.STRING,
      },

      message: {
        type: DataTypes.TEXT,
      },

    },
    {
      tableName: "plclogs",
    }
  );

};
