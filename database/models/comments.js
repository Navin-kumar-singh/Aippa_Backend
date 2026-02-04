const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      commentType:{
        type: DataTypes.STRING, 
        allowNull: true,
        validate: {
          isIn: [['club', 'timeline']], 
        },
        defaultValue:'club'
      },
      userType: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          isIn: [['institute', 'student','teacher']], 
        },
        defaultValue:'institute'
      },

      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userRole:{
        type: DataTypes.TEXT,
        allowNull: false,
      },
      commentBy: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING, 
        allowNull: true, 
      },
      logo:{
        type: DataTypes.STRING, 
        allowNull: true, 
      },
      loading: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      
  },  {
    sequelize,
    tableName: 'comments',
    timestamps: true,
   
  }
  );
};
