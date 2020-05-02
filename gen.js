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

function wr(...args) {
    if (args[1] || args[1] === 0) {
        fs.appendFileSync(GEN_FILE, args[0] + ' ' + args[1] + '\n');
    } else {
        fs.appendFileSync(GEN_FILE, args[0] + '\n');
    }
}

// ========================================

// for (let hundreds = 0; hundreds < 1000; hundreds += 100) {
//     for (let i = hundreds + 2; i < hundreds + 100 + 1; i++) {
//         wr(`${i - 1} ${ i}\n`);
//     }
// }

wr(1001);

for (let hundreds = 0; hundreds < 400; hundreds += 100) {
    for (let i = hundreds + 2; i < hundreds + 100 + 1; i++) {
        wr(`${i - 1} ${ i}`);
    }
}


wr(0, 0)