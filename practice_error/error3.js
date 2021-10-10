const fs = require('fs').promises;

setInterval(()=>{
    fs.unlink('./fafewa.js')
}, 1000);