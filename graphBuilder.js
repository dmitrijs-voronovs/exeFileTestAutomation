var fs = require('fs');
var c = require('./fileConstants');

const GRAPH_QUANTITY = process.argv[2] || 5;
const ONLY_ONE_GRAPH = process.argv[3] || false;

function generateDiagram(filename) {
    const filestring = fs.readFileSync(filename, { encoding: 'UTF-8' });
    const lines = filestring.split(/\n/);
    console.log(lines);
    if (lines[lines.length - 1] === '') {
        lines.pop();
    }
    lines.shift();
    lines.pop();
    for (i in lines) {
        const parts = lines[i].split(' ');
        lines[i] = `[${ parts[0] }] - [${ parts[1] }]`;
    }
    lines[lines.length] = '#fill: white;';
    console.log(lines.join('\n'));
}

function generateAllDiagrams(till, onlyOne = false) {
    const start = onlyOne
        ? till
        : 1;

    for (let i = start; i <= till; i++) {
        generateDiagram(c.INPUT_FOLDER_PATH + c.TEST_PREFIX + i);
        console.log('-------------');
    }
}

generateAllDiagrams(GRAPH_QUANTITY, ONLY_ONE_GRAPH);