const mongoos = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoos.Mongoose.set('debug', true);
    }
    mongoos.connect('mongodb://root:111111@localhost:27017/admin', {
        dbName: 'nodejs',
        useNewUrlParser: true,
        useCreateIndex: true,
    }, (error) =>{
        if (error){
            console.log('몽고디비 연결 에러', error);
        } else {
            console.log('몽고디비 연결 성공');
        }
    });
};
mongoos.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
});
mongoos.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

module.exports = connect;