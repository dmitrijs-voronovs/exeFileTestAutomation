var child = require('child_process').execFileSync;
var executablePath = "exe\\parcels_" + process.argv[2] + ".exe";
var parameters = ["--incognito"];


function main() {
    try {
        child(executablePath, parameters, {
            encoding: 'UTF-8',
            timeout: 100
        });
    } catch (e) {
        console.log('error', e.status, e);
    } finally {
        console.log('done');
    }
}

main();