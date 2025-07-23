// eslint-disable-next-line no-unused-vars
const path = require('path');
const fs = require('fs');

const baseDir = __dirname.split('/scripts')[0];

const componentDirectory = `${baseDir}/src/stories`;

// Directories to intentionally ignore
const ignoreDirectories = [
    'assets',
];

const run = async () => {
    // Record start time
    const startTime = Date.now();

    // Iterate through the directory and get a list of subdirectories
    const subDirectories = fs
        .readdirSync(componentDirectory, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .filter((directory) => !ignoreDirectories.includes(directory));

    // Import package.json

    const packageFile = require(`${baseDir}/package.json`);

    // Update exports in package.json
    packageFile.exports = subDirectories.reduce((acc, subDirectory) => {
        acc[`./${subDirectory}`] = `./src/stories/${subDirectory}/index.ts`;
        return acc;
    }, {
        './*': './src/stories/*',
    });

    // Write the package.json file
    await fs.promises.writeFile(`${baseDir}/package.json`, JSON.stringify(packageFile, null, 4), { encoding: 'utf8' });

    return `✅  Package exports updated in ${Date.now() - startTime}ms.`;
};

run().then(console.log).catch(console.error);
