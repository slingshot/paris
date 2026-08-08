// Turn a Vitest JSON report into GitHub Actions step outputs for the CI PR comment.
//
// This replaces scraping Vitest's human-readable reporter with `grep -oP`, which
// silently reported "0 tests" for every run. Three separate things broke it:
//
//  1. Vitest emits ANSI colour in CI. tinyrainbow/picocolors enable colour when
//     `env.CI` is set — an isatty() check is NOT required — and GitHub Actions
//     always sets `CI=true`. So the captured summary line is really
//     `\e[2m      Tests \e[22m \e[1m\e[32m655 passed\e[39m…`, and a pattern
//     anchored as `^\s+Tests` can never match: the first byte is ESC, not a space.
//  2. `\s` cannot cross an escape sequence, so `Duration\s+\K[\d.]+s` missed
//     `Duration \e[22m 13.12s`, and `\d+ms` missed `505\e[2mms`.
//  3. Per-file lines carry a project badge — ` ✓  unit  src/foo.test.tsx` — so
//     `(✓|×)\s+src/` failed even with the colour stripped.
//
// Reading the JSON reporter sidesteps all three: no colour, no layout, no badges.
//
// Usage: node scripts/ciTestSummary.mjs <report.json> [--label <name>]
// Appends `key=value` pairs to $GITHUB_OUTPUT (or prints them when unset).
import { appendFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const EMPTY_SUMMARY = { pass: 0, fail: 0, skipped: 0, files: 0, duration: '0s', fileResults: [] };

// Heredoc delimiter for $GITHUB_OUTPUT. File paths can never contain this token,
// so the JSON blob can't terminate its own block.
const DELIMITER = 'PARIS_CI_SUMMARY_EOF';

function formatMs(ms) {
    if (!Number.isFinite(ms) || ms <= 0) return '0ms';
    return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;
}

// `src/stories/<component>/Foo.test.tsx` → `<component>`. Anything outside the
// component tree (helpers, hooks) falls back to the bare test name, so the
// breakdown table never renders a full path in the Component column.
export function componentFor(file) {
    const inStories = file.match(/(?:^|\/)src\/stories\/([^/]+)\//);
    if (inStories) return inStories[1];
    return path.basename(file).replace(/\.test\.[cm]?[jt]sx?$/, '') || file;
}

// Vitest's JSON report has no top-level duration, so derive the wall span from
// the reporter's init timestamp to the last assertion to finish.
function durationFor(report, suites) {
    const start = report.startTime ?? 0;
    const end = suites.reduce((max, suite) => Math.max(max, suite.endTime ?? 0), 0);
    if (!start || end <= start) return '0s';
    return `${((end - start) / 1000).toFixed(2)}s`;
}

export function summarizeReport(report, root = process.cwd()) {
    if (!report || !Array.isArray(report.testResults)) return { ...EMPTY_SUMMARY };

    const fileResults = report.testResults.map((suite) => {
        const assertions = Array.isArray(suite.assertionResults) ? suite.assertionResults : [];
        const failed = assertions.filter((a) => a.status === 'failed').length;
        // `name` is absolute; make it repo-relative and POSIX-separated for display.
        const file = suite.name ? path.relative(root, suite.name).split(path.sep).join('/') : 'unknown';
        return {
            file,
            component: componentFor(file),
            tests: assertions.length,
            failed,
            time: formatMs((suite.endTime ?? 0) - (suite.startTime ?? 0)),
            // A suite can fail without any failing assertion (e.g. a beforeAll throw),
            // so trust the reported status as well as the assertion tally.
            status: suite.status === 'failed' || failed > 0 ? 'fail' : 'pass',
        };
    });

    return {
        pass: report.numPassedTests ?? 0,
        fail: report.numFailedTests ?? 0,
        skipped: (report.numPendingTests ?? 0) + (report.numTodoTests ?? 0),
        // NOT `numTotalTestSuites` — that counts `describe` blocks (165 for 36 files).
        files: fileResults.length,
        duration: durationFor(report, report.testResults),
        fileResults,
    };
}

export function formatOutputs(summary) {
    return [
        `total-pass=${summary.pass}`,
        `total-fail=${summary.fail}`,
        `total-skipped=${summary.skipped}`,
        `total-files=${summary.files}`,
        `duration=${summary.duration}`,
        `file-results<<${DELIMITER}`,
        JSON.stringify(summary.fileResults),
        DELIMITER,
    ].join('\n');
}

function main() {
    const reportPath = process.argv[2];
    const label = process.argv.includes('--label') ? process.argv[process.argv.indexOf('--label') + 1] : 'tests';

    let report = null;
    try {
        report = JSON.parse(readFileSync(reportPath, 'utf8'));
    } catch (error) {
        // A crash before the reporter runs (config error, OOM) leaves no report.
        // Emit zeros so the comment step falls back to "View logs" rather than
        // failing the job a second time on top of the real failure.
        console.error(`[ci-summary] could not read ${reportPath}: ${error.message}`);
    }

    const summary = summarizeReport(report);
    console.log(
        `[ci-summary] ${label}: ${summary.pass} passed, ${summary.fail} failed, ` +
            `${summary.skipped} skipped across ${summary.files} files in ${summary.duration}`,
    );

    const outputs = formatOutputs(summary);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${outputs}\n`);
    else console.log(outputs);
}

// Only run as a CLI, so tests can import the pure helpers above. Use
// pathToFileURL rather than string-concatenating `file://` — a checkout path
// containing a space would otherwise fail to match and silently skip main(),
// reproducing the very "0 tests" symptom this script exists to fix.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
