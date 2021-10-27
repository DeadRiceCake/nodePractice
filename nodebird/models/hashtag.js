const Sequelize = require('sequelize');

// 시퀄라이즈 테이블(hashtag) 생성 모델
module.exports = class Hashtag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(15),
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    // post테이블과의 관계 설정
    static associate(db) {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    }
};