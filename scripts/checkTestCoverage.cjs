const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const STORIES_DIR = path.join(__dirname, '..', 'src', 'stories');

// Get all component directories
const components = fs.readdirSync(STORIES_DIR).filter((name) => {
    const dir = path.join(STORIES_DIR, name);
    return fs.statSync(dir).isDirectory();
});

function gitLastModified(filePath) {
    try {
        const timestamp = execFileSync('git', ['log', '-1', '--format=%ct', '--', filePath], {
            encoding: 'utf-8',
        }).trim();
        return timestamp ? parseInt(timestamp, 10) : 0;
    } catch {
        return 0;
    }
}

const results = { missing: [], stale: [], current: [] };

for (const component of components) {
    const dir = path.join(STORIES_DIR, component);
    const files = fs.readdirSync(dir);

    // Find the main component file(s) — skip index.ts, stories, tests, scss
    const sourceFiles = files.filter(
        (f) =>
            (f.endsWith('.tsx') || f.endsWith('.ts')) &&
            !f.endsWith('.test.tsx') &&
            !f.endsWith('.test.ts') &&
            !f.endsWith('.stories.tsx') &&
            !f.endsWith('.stories.ts') &&
            !f.endsWith('.module.scss') &&
            f !== 'index.ts',
    );

    const testFiles = files.filter((f) => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));

    if (testFiles.length === 0) {
        results.missing.push({ component, sourceFiles });
        continue;
    }

    // Compare git timestamps: latest source change vs latest test change
    const latestSourceTime = Math.max(...sourceFiles.map((f) => gitLastModified(path.join(dir, f))));

    const latestTestTime = Math.max(...testFiles.map((f) => gitLastModified(path.join(dir, f))));

    if (latestSourceTime > latestTestTime) {
        const sourceDate = new Date(latestSourceTime * 1000).toISOString().split('T')[0];
        const testDate = new Date(latestTestTime * 1000).toISOString().split('T')[0];

        // Get which source files changed after the test was last updated
        const changedFiles = sourceFiles.filter((f) => {
            return gitLastModified(path.join(dir, f)) > latestTestTime;
        });

        results.stale.push({
            component,
            sourceFiles,
            testFiles,
            sourceDate,
            testDate,
            changedFiles,
        });
    } else {
        results.current.push({ component, testFiles });
    }
}

// Output
const flag = process.argv[2];

if (flag === '--json') {
    console.log(JSON.stringify(results, null, 2));
} else {
    if (results.missing.length > 0) {
        console.log('\n🚨 Components with NO tests:');
        for (const { component, sourceFiles } of results.missing) {
            console.log(`  ${component}/  (${sourceFiles.join(', ')})`);
        }
    }

    if (results.stale.length > 0) {
        console.log('\n⚠️  Components with STALE tests (source changed after tests):');
        for (const { component, sourceDate, testDate, changedFiles } of results.stale) {
            console.log(`  ${component}/  source: ${sourceDate}, tests: ${testDate}`);
            console.log(`    changed: ${changedFiles.join(', ')}`);
        }
    }

    if (results.current.length > 0) {
        console.log(`\n✅ ${results.current.length} components with up-to-date tests`);
    }

    // Summary
    const total = components.length;
    console.log(
        `\n📊 ${total} components: ${results.current.length} current, ${results.stale.length} stale, ${results.missing.length} missing`,
    );

    if (results.missing.length > 0 || results.stale.length > 0) {
        process.exit(1);
    }
}
