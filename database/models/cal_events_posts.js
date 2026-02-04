const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('cal_events_posts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        instituteId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        post_type:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        post_type_id:{
            type:DataTypes.INTEGER,
            allowNull:true,
        },
        post_type_link:{
            type:DataTypes.TEXT,
            allowNull:true,
        },
        videoId:{
            type:DataTypes.STRING,
            allowNull:true,
        },

    }, {
        tableName: 'cal_events_posts',
        timestamps: true,
    });
};
