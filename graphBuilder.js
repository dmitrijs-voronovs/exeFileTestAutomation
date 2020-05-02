var fs = require('fs');
var c = require('./fileConstants');
var generateDiagram = require('nomnoml-cli');

const GRAPH_QUANTITY = process.argv[2] || 5;
const ONLY_ONE_GRAPH = process.argv[3] || false;

function formatInputFileData(filename) {
    const filestring = fs.readFileSync(filename, { encoding: 'UTF-8' });
    const lines = filestring.split(/\r\n/);
    if (lines[lines.length - 1] === '') {
        lines.pop();
    }
    lines.shift();
    lines.pop();
    for (i in lines) {
        const parts = lines[i].split(' ');
        lines[i] = `[${ parts[0] }] - [${ parts[1] }]`;
    }
    lines[lines.length] = '#fill: white';
    lines[lines.length] = '#bendSize: 0.29';
    lines[lines.length] = '#ranker: longest-path';
    lines[lines.length] = '#spacing: 15';
    return lines.join('\n');
}

function generateAllDiagrams(till, onlyOne = false) {
    const start = onlyOne
        ? till
        : 1;

    for (let i = start; i <= till; i++) {
        const input = formatInputFileData(c.INPUT_FOLDER_PATH + c.TEST_PREFIX + i);
        let terminateManually = true;
        generateDiagram({
            input,
            output: c.INPUT_DIAGRAMS_FOLDER_PATH + i + '.png'
        }).then(() => {
            terminateManually = false;
            console.log(`Generating diagram for ${ i } test`);
            console.log(input);
        }).catch(e => {
            console.log('Unable to generate diagram for', i, '\n', e);
        });
    }
}

generateAllDiagrams(GRAPH_QUANTITY, !!ONLY_ONE_GRAPH);