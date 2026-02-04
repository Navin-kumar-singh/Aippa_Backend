const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('posts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          isIn: [['club', 'timeline', 'profile']], 
        },
        defaultValue:'timeline'
      },
      userType: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
          isIn: [['institute', 'student','teacher']], 
        },
        defaultValue:'institute'
      },
      postBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      instituteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      clubId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      youTubeLink: {
        type: DataTypes.STRING, 
        allowNull: true, 
      },
      youTubeId: {
        type: DataTypes.STRING, 
        allowNull: true, 
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
      likes: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: [],
      },
      commentsCount:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:0,
      },
     
  },  {
    sequelize,
    tableName: 'posts',
    timestamps: true,
   
  }
  );
};
