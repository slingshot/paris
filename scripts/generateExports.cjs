const fs = require('node:fs');

const baseDir = __dirname.split('/scripts')[0];
const componentDirectory = `${baseDir}/src/stories`;

// Directories to intentionally ignore
const ignoreDirectories = ['assets'];

const run = async () => {
    const startTime = Date.now();

    const subDirectories = fs
        .readdirSync(componentDirectory, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .filter((directory) => !ignoreDirectories.includes(directory));

    // eslint-disable-next-line import/no-dynamic-require
    const packageFile = require(`${baseDir}/package.json`);

    // Compiled-target exports. Each component subpath resolves to its built ESM
    // entry + per-file declaration; styles are precompiled CSS (no Sass needed).
    const exportsMap = {
        './styles.css': './dist/styles.css',
        './theme/global.css': './dist/stories/theme/global.css',
    };

    // Optional root barrel, only if one actually exists.
    if (fs.existsSync(`${componentDirectory}/index.ts`)) {
        exportsMap['.'] = {
            types: './dist/stories/index.d.ts',
            import: './dist/stories/index.js',
        };
    }

    for (const subDirectory of subDirectories) {
        exportsMap[`./${subDirectory}`] = {
            types: `./dist/stories/${subDirectory}/index.d.ts`,
            import: `./dist/stories/${subDirectory}/index.js`,
        };
    }

    packageFile.exports = exportsMap;

    await fs.promises.writeFile(`${baseDir}/package.json`, `${JSON.stringify(packageFile, null, 4)}\n`, {
        encoding: 'utf8',
    });

    return `✅  Compiled package exports updated in ${Date.now() - startTime}ms.`;
};

run().then(console.log).catch(console.error);
