const path = require('path');
const fs = require('fs');

const baseDir = path.resolve(process.cwd());

const componentDirectory = `${baseDir}/src/stories`;

// Directories to intentionally ignore
const ignoreDirectories = [
    'assets',
];

const run = async () => {
    // Iterate through the directory and get a list of subdirectories
    const subDirectories = fs
        .readdirSync(componentDirectory, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .filter((directory) => !ignoreDirectories.includes(directory));

    // Generate entry point file
    const entryPointFile = `${baseDir}/index.ts`;
    const entryPointCode = subDirectories
        .map((subDirectory) => `export * from './src/stories/${subDirectory}';`)
        .join('\n')
        .concat('\n');

    // Write the entry point file
    await fs.promises.writeFile(entryPointFile, entryPointCode, { encoding: 'utf8' });

    return '✅  Entry point file generated.';
};

run().then(console.log).catch(console.error);
