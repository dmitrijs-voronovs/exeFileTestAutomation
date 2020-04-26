var execFile = require('child_process').execFile;
var fs = require('fs');

const ORIGINAL_INPUT = 'parcels.in';
const ORIGINAL_OUTPUT = 'parcels.out';
const TEST_QUANTITY = process.argv[2] || 5;
const TEST_TIME_LIMIT = 100;
let executable;

async function readFromFile(programName, inputName, outputName) {
    return new Promise((resolve, reject) => {
        try {
            let cancelled = false
            console.log('Running', programName, inputName, '->', outputName);
            executable = execFile(programName, (err, stdout, stderr) => {
                console.log([err, stdout, stderr]);

                if (!err) {
                    console.log('Good!');
                    cancelled = true;
                    return resolve(true);
                }

                if (err) {
                    console.log('Baad!');
                    cancelled = true;
                    return resolve(true);
                }

                return reject(999);
            });

            setTimeout(() => {
                console.log('Failed', cancelled);
                if (!cancelled) reject(false);
            }, TEST_TIME_LIMIT);
        } catch (e) {
            reject(false);
        }
    });
}

async function runProgram(programName, inputName, outputName, appendFout = true) {
    const numberInProgramName = programName.match(/\d/)[0] || 0;
    const numberInTestName = inputName.match(/\d/)[0] || 0;

    if (inputName !== ORIGINAL_INPUT) {
        fs.copyFileSync(inputName, ORIGINAL_INPUT);
    }

    let goodRun = false;
    if (appendFout) {
        if (!fs.existsSync(numberInTestName)) fs.mkdirSync(numberInTestName);
    }

    const fout = appendFout ? numberInTestName + '/' + numberInProgramName + '_' + outputName : outputName;

    try {
        goodRun = await readFromFile(programName, inputName, outputName);
    } catch (e) {
        // console.log('in catch', e);
        // fs.appendFileSync(fout, '\nFAILED\n-------');
    } finally {
        fs.copyFileSync(ORIGINAL_OUTPUT, fout);
        if (!goodRun) {
            fs.appendFileSync(fout, '\n-------\nFAILED');
        }
        return Promise.resolve();
    }

}

const allPrograms = [
    'parcels_1.exe',
    'parcels_2.exe',
    'parcels_3.exe',
    'parcels_4.exe',
    'parcels_5.exe'
];

async function runPrograms() {
    for (let i = 0; i < allPrograms.length; i++) {
        for (let j = 1; j <= TEST_QUANTITY; j++) await runProgram(allPrograms[i], 'parcels.i' + j, 'parcels.o' + j)
    }
    process.exit();
}

runPrograms();

// runProgram('parcels_5.exe', ORIGINAL_INPUT, ORIGINAL_OUTPUT, false);