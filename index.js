var execFileSync = require('child_process').execFileSync;
var fs = require('fs');

const TEST_FOLDER_PATH = './tests/';
const INPUT_FOLDER_PATH = TEST_FOLDER_PATH + 'input/';
const CORRRECT_OUTPUT_FOLDER_PATH = TEST_FOLDER_PATH + 'output/';
const EXECUTABLE_PATH = './exe/';
const TEST_PREFIX = 'parcels.i';
const TEST_RESULT_PREFIX = 'parcels.o';
const PROGRAM_DEFAULT_INPUT_PATH = './' + TEST_PREFIX + 'n';
const PROGRAM_DEFAULT_OUTPUT_PATH = './' + TEST_RESULT_PREFIX + 'ut';

const TEST_QUANTITY = process.argv[2] || 5;
const ONLY_ONE_TEST = process.argv[3] || false;

// const parameters = ["--incognito"];

const allPrograms = [
    './exe/parcels_1.exe',
    './exe/parcels_2.exe',
    './exe/parcels_3.exe',
    './exe/parcels_4.exe',
    './exe/parcels_5.exe'
];
const statistics = {};

function runTest(exeNumber, testNumber) {
    const exePath = allPrograms[exeNumber];
    copyFile(INPUT_FOLDER_PATH + TEST_PREFIX + testNumber, PROGRAM_DEFAULT_INPUT_PATH);
    const success = runExe(exePath);
    console.log(success);
    checkAndCreateFolder(TEST_FOLDER_PATH + testNumber);
    copyFile(PROGRAM_DEFAULT_OUTPUT_PATH, TEST_FOLDER_PATH + testNumber + '/' + TEST_RESULT_PREFIX + (exeNumber + 1));
    if (!success) {
        fs.appendFileSync(TEST_FOLDER_PATH + testNumber + '/' + TEST_RESULT_PREFIX + (exeNumber + 1), `\n------\nFAILED`);
    }
}

function runExe(executablePath) {
    console.log(executablePath);
    console.log(readFileInsides(PROGRAM_DEFAULT_INPUT_PATH));
    let success = true;
    let process;
    try {
        process = execFileSync(executablePath, [], {
            timeout: 200
        });
    } catch (e) {
        console.log('error', e.errno || e.status || e.code, e);
        success = false;
    } finally {
        console.log(process && process.toString('utf-8'));
        console.log('done');
        console.log(readFileInsides(PROGRAM_DEFAULT_OUTPUT_PATH));
        return success;
    }
}

function checkAndCreateFolder(folderName) {
    if (!fs.existsSync(folderName)) fs.mkdirSync(folderName);
}

function copyFile(from, to) {
    console.log('copy', from, to);
    try {
        fs.copyFileSync(from, to);
    } catch (e) {
        console.log('failed copyting', from, to);
    }
}

function readFileInsides(filename) {
    const fileInfo = fs.readFileSync(filename, { encoding: 'UTF-8' });
    console.log(fileInfo.split('\r\n'));

    // const fileExpected = fs.readFileSync('./parcels.expected', { encoding: 'UTF-8' });
    // console.log(fileExpected, fileExpected === fileInfo);
}

function checkEqualFiles(f1, f2) {
    return true;
}

function runAllTests(till, onlyOne = false) {
    for (let i = 0; i < 5; i++) {
        const start = onlyOne
            ? till
            : 1;
        statistics[allPrograms[i]] = {};

        for (let j = start; j <= till; j++) {
            console.log(`Running parcels_${ i + 1 }.exe\t Test parcels.i${ j }`)
            runTest(i, j)
        }
    }
    console.log(statistics);
    process.exit();
}

console.log('----------------------------------------------------');
runAllTests(TEST_QUANTITY, !!ONLY_ONE_TEST);
// runTest(process.argv[2], process.argv[3]);