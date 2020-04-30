var execFile = require('child_process').execFile;
var fs = require('fs');

const TEST_FOLDER_NAME = 'tests/';
const INPUT_FOLDER_NAME = 'input/';
const ORIGINAL_INPUT = 'parcels.in';
const ORIGINAL_OUTPUT = 'parcels.out';
const TEST_QUANTITY = process.argv[2] || 5;
const TEST_TIME_LIMIT = 100;
let executable;

async function runExeFile(programName) {
    return new Promise((resolve, reject) => {
        try {
            let cancelled = false
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

async function runProgram(programName, input, outputName, appendFout = true) {
    const inputName = TEST_FOLDER_NAME + INPUT_FOLDER_NAME + input;
    const numberInProgramName = programName.match(/\d/)[0] || '0';
    const numberInTestName = inputName.match(/\d/)[0] || '0';

    let goodRun = false;
    if (appendFout) {
        if (!fs.existsSync(TEST_FOLDER_NAME + numberInTestName)) fs.mkdirSync(TEST_FOLDER_NAME + numberInTestName);
    }

    const fout = appendFout
        ? TEST_FOLDER_NAME + numberInTestName + '/' + numberInProgramName + '_' + outputName
        : outputName;

    fs.copyFileSync(inputName, ORIGINAL_INPUT);

    try {
        goodRun = await runExeFile(programName, inputName, outputName);
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
    'exe/parcels_1.exe',
    'exe/parcels_2.exe',
    'exe/parcels_3.exe',
    'exe/parcels_4.exe',
    'exe/parcels_5.exe'
];

async function runPrograms() {
    for (let i = 0; i < allPrograms.length; i++) {
        for (let j = 1; j <= TEST_QUANTITY; j++) {
            console.log(`Running parcels_${ i }.exe\t Test parcels.i${ j }`)
            let timer = new Date();
            await runProgram(allPrograms[i], 'parcels.i' + j, 'parcels.o' + j);
            timer = new Date() - timer;
            console.log(timer)
        }
    }
    process.exit();
}

runPrograms();

// runProgram('parcels_5.exe', ORIGINAL_INPUT, ORIGINAL_OUTPUT, false);