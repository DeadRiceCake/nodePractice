setInterval(() =>{
    console.log('시작');
    try {
        throw new Error('kill server');
    } catch (error) {
        console.error(error);
    }
}, 1000);