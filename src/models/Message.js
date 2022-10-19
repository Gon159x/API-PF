const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  //CUANDO MANDO UN MENSAJE,  
  sequelize.define(
    "Message",
    {      id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
        type: DataTypes.STRING,
        defaultValue: ""
      }},
    {
      timestamps: false,
    }
  );
};
