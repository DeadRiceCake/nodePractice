const fs = require('fs');

setInterval(() => {
    fs.unlink('./fsefds.js', (err) => {
        if(err){
            console.error(err);
        }
    });
}, 1000);