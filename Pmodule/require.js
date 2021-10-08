console.log("require가 가장 위에 오지 않아도 됩니다.");

module.exports = "저를 찾아보십쇼";

require("./var");

console.log("require.cache입니다.");
console.log(require.cache);
console.log("require.main입니다.");
console.log(require.main === module);
console.log(require.main.filename);

const os = require("os");
console.log("코어 갯수 : " + os.cpus().length);
