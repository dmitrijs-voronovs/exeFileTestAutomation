// for (let i = 1; i < 8; i++) {
//     // let result = '1 '
//     for (let j = 1; j <= i; j++) {
//         if (i !== j) console.log(i, j);
//     }
//     // console.log(result);
// }

var fs = require('fs');
const GEN_FILE = './gen.txt';
fs.truncateSync(GEN_FILE);

function appendF(data) {
    fs.appendFileSync(GEN_FILE, data);
}

for (let hundreds = 0; hundreds < 1000; hundreds += 100) {
    for (let i = hundreds + 2; i < hundreds + 100 + 1; i++) {
        appendF(`${i - 1} ${ i}\n`);
    }
}