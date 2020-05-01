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

const TIME_LIMIT = 200;
const TEST_QUANTITY = process.argv[2] || 5;
const ONLY_ONE_TEST = process.argv[3] || false;

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

    let time = new Date();
    const success = runExe(exePath);
    time = new Date() - time;
    console.log(success);
    checkAndCreateFolder(TEST_FOLDER_PATH + testNumber);

    const outputPath = TEST_FOLDER_PATH + testNumber + '/' + TEST_RESULT_PREFIX + (exeNumber + 1);
    copyFile(PROGRAM_DEFAULT_OUTPUT_PATH, outputPath);

    const equal = checkEqualFiles(outputPath, CORRRECT_OUTPUT_FOLDER_PATH + TEST_RESULT_PREFIX + testNumber)
    if (!success) {
        // fs.appendFileSync(outputPath, `\n------\nFAILED`);
        statistics[exePath][testNumber] = { equal, status: time < TIME_LIMIT / 10 ? 'OK' : 'failed', time };
    } else {
        statistics[exePath][testNumber] = { equal, status: 'pass', time };
    }
}

function runExe(executablePath) {
    // console.log(printFile(PROGRAM_DEFAULT_INPUT_PATH));
    let success = true;
    let process;
    try {
        process = execFileSync(executablePath, [], {
            timeout: TIME_LIMIT
        });
    } catch (e) {
        // console.log('error', e.errno || e.status || e.code, e);
        console.log('error', e.errno || e.status || e.code, e);
        success = false;
    } finally {
        console.log('done');
        // console.log(printFile(PROGRAM_DEFAULT_OUTPUT_PATH));
        return success;
    }
}

function checkAndCreateFolder(folderName) {
    if (!fs.existsSync(folderName)) fs.mkdirSync(folderName);
}

function copyFile(from, to) {
    // console.log('copy', from, to);
    try {
        fs.copyFileSync(from, to);
    } catch (e) {
        console.log('failed copyting', from, to);
    }
}

function printFile(filename) {
    const fileInfo = fs.readFileSync(filename, { encoding: 'UTF-8' });
    console.log(fileInfo);
}

function checkEqualFiles(f1, f2) {
    const fileInfo1 = fs.readFileSync(f1, { encoding: 'UTF-8' });
    const fileInfo2 = fs.readFileSync(f2, { encoding: 'UTF-8' });
    return fileInfo1 === fileInfo2;
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