const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let result = 0;

rl.on('line', function (A, B) {
    input.push(A);
    input.push(B);
    result = A + B;
  })
  .on('close', function () {
    console.log(result);
    process.exit();
});