process.on('uncaughtException', (err)=>{
    console.error('예기치못한 에러', err);
});

setInterval(()=>{
    throw new Error('server killer');
}, 1000);

setTimeout(()=>{
    console.log('running...');
}, 2000);