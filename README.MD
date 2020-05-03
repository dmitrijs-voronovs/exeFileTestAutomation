# TESTESANA #5
This is test automation program for **.exe** files (specifically for gailis.exe program)

## Runs tests and summarizes results

![image](https://user-images.githubusercontent.com/44952559/80910827-ec484400-8d3a-11ea-9c63-5cc769156970.png)

## Creates graphical representations of tests

![22](https://user-images.githubusercontent.com/44952559/80910776-878ce980-8d3a-11ea-9b7a-a56ad1ae2d22.png)

### installation
1. Download and install Node.js
2. `git clone git@github.com:DmitryVoronovLV/exeFileTestAutomation.git`
3. `cd exeFileTestAutomation`
4. `npm i`

### How to use
#### Run tests and get summary
To run a single test use
> `node index <int: test number> true`

For instance, to run test No 7 use command `node index 7 true`

To run all tests until indicated (including it) use
> `node index <int: test number>`

For instance, to run all tests 1 - 10 (including) use command `node index 10`

#### Create graphical representation of a test
The same rule applies to creating graphical representations.
To create a signle diagram use
> `node graphBuilder <int: test number> true`

To create all diagrams till certain test number (including) use
> `node graphBuilder <int: test number>`
