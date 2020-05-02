var execFileSync = require('child_process').execFileSync;
var fs = require('fs');
var c = require('./fileConstants');

const TIME_LIMIT = 2000;
const TEST_QUANTITY = process.argv[2] || 5;
const ONLY_ONE_TEST = process.argv[3] || false;

const allPrograms = [
    c.EXECUTABLE_PATH + 'gailis_1.exe',
    c.EXECUTABLE_PATH + 'gailis_2.exe',
    c.EXECUTABLE_PATH + 'gailis_3.exe',
    c.EXECUTABLE_PATH + 'gailis_4.exe',
    c.EXECUTABLE_PATH + 'gailis_5.exe'
];
const statistics = {};

function runTest(exeNumber, testNumber) {
    const exePath = allPrograms[exeNumber];
    copyFile(c.INPUT_FOLDER_PATH + c.TEST_PREFIX + testNumber, c.PROGRAM_DEFAULT_INPUT_PATH);
    deleteFile(c.PROGRAM_DEFAULT_OUTPUT_PATH);

    let time = new Date();
    const { success, errorCode } = runExe(exePath);
    time = new Date() - time;
    console.log(success);
    checkAndCreateFolder(c.TEST_FOLDER_PATH + testNumber);

    const outputPath = c.TEST_FOLDER_PATH + testNumber + '/' + c.TEST_RESULT_PREFIX + (exeNumber + 1);

    deleteFile(outputPath);
    const copiedSuccesfully = copyFile(c.PROGRAM_DEFAULT_OUTPUT_PATH, outputPath);

    console.log(copiedSuccesfully);

    const equal = copiedSuccesfully
        ? checkEqualFiles(outputPath, c.CORRRECT_OUTPUT_FOLDER_PATH + c.TEST_RESULT_PREFIX + testNumber)
        : false;

    if (!success) {
        // fs.appendFileSync(outputPath, `\n------\nFAILED`);
        statistics[exePath][testNumber] = { equal, status: 'FAIL', time };
    } else {
        statistics[exePath][testNumber] = { equal, status: 'OK', time };
    }
}

function runExe(executablePath) {
    // console.log(printFile(c.PROGRAM_DEFAULT_INPUT_PATH));
    let success = true;
    let process;
    let errorCode;
    try {
        process = execFileSync(executablePath, [], {
            timeout: TIME_LIMIT
        });
    } catch (e) {
        // console.log('error', e.errno || e.status || e.code, e);
        console.log('error', e.errno || e.status || e.code, e);
        errorCode = e.code;
        success = false;
    } finally {
        console.log('done');
        // console.log(printFile(c.PROGRAM_DEFAULT_OUTPUT_PATH));
        return {
            success, errorCode
        };
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
        console.log('failed copying', from, to);
        return false;
    }
    return true;
}

function printFile(filename) {
    const fileInfo = fs.readFileSync(filename, { encoding: 'UTF-8' });
    console.log(fileInfo);
}

function deleteFile(filename) {
    try {
        fs.unlinkSync(filename);
    } catch (e) {
        console.log('no file to delete by path', filename);
    }
}

function cleanFileFromLastEmptyLine(filestring) {
    const lines = filestring.split('\r\n');
    if (lines[lines.length - 1] === '') {
        lines.pop();
    }
    return lines.join('\r\n');
}

function checkEqualFiles(filename, filename2) {
    const fileInfo1 = cleanFileFromLastEmptyLine(fs.readFileSync(filename, { encoding: 'UTF-8' }));
    const fileInfo2 = cleanFileFromLastEmptyLine(fs.readFileSync(filename2, { encoding: 'UTF-8' }));

    return fileInfo1 === fileInfo2;
}

function runAllTests(till, onlyOne = false) {
    for (let i = 0; i < 5; i++) {
        const start = onlyOne
            ? till
            : 1;
        statistics[allPrograms[i]] = {};

        for (let j = start; j <= till; j++) {
            console.log(`Running gailis_${ i + 1 }.exe\t Test gailis.i${ j }`)
            runTest(i, j)
        }
    }
    console.log(statistics);
    process.exit();
}

console.log('----------------------------------------------------');
runAllTests(TEST_QUANTITY, !!ONLY_ONE_TEST);
// runTest(process.argv[2], process.argv[3]);
