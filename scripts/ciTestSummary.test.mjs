import { describe, expect, it } from 'vitest';
import { componentFor, formatOutputs, summarizeReport } from './ciTestSummary.mjs';

const root = '/repo';

/** A green run: two files, five tests, no failures. */
const passingReport = {
    // Deliberately unequal to `testResults.length` — Vitest counts `describe`
    // blocks here (165 for 36 real files), so it must NOT be used as a file count.
    numTotalTestSuites: 9,
    numTotalTests: 5,
    numPassedTests: 5,
    numFailedTests: 0,
    numPendingTests: 0,
    numTodoTests: 0,
    startTime: 1_000,
    success: true,
    testResults: [
        {
            name: `${root}/src/stories/checkbox/Checkbox.test.tsx`,
            status: 'passed',
            startTime: 1_100,
            endTime: 1_605,
            assertionResults: [
                { title: 'a', status: 'passed' },
                { title: 'b', status: 'passed' },
                { title: 'c', status: 'passed' },
            ],
        },
        {
            name: `${root}/src/helpers/useControllableState.test.ts`,
            status: 'passed',
            startTime: 1_200,
            endTime: 1_700,
            assertionResults: [
                { title: 'd', status: 'passed' },
                { title: 'e', status: 'passed' },
            ],
        },
    ],
};

describe('summarizeReport', () => {
    it('reports the real test totals for a green run', () => {
        // Regression: the old grep-based parser reported 0 here because Vitest
        // colourises its summary in CI and `^\s+Tests` cannot match a line
        // starting with an ESC byte.
        const summary = summarizeReport(passingReport, root);

        expect(summary.pass).toBe(5);
        expect(summary.fail).toBe(0);
        expect(summary.files).toBe(2);
        // Reporter init (1_000) → last assertion to finish (1_700).
        expect(summary.duration).toBe('0.70s');
    });

    it('counts files from testResults, not the describe-block total', () => {
        const summary = summarizeReport(passingReport, root);

        expect(summary.files).toBe(2);
        expect(summary.files).not.toBe(passingReport.numTotalTestSuites);
    });

    it('derives repo-relative paths and component names', () => {
        const [checkbox, helper] = summarizeReport(passingReport, root).fileResults;

        expect(checkbox).toMatchObject({
            file: 'src/stories/checkbox/Checkbox.test.tsx',
            component: 'checkbox',
            tests: 3,
            failed: 0,
            time: '505ms',
            status: 'pass',
        });
        // Outside src/stories there is no component, so fall back to the test name.
        expect(helper).toMatchObject({ component: 'useControllableState', tests: 2 });
    });

    it('reports failures and marks the owning file', () => {
        const summary = summarizeReport(
            {
                ...passingReport,
                numPassedTests: 4,
                numFailedTests: 1,
                success: false,
                testResults: [
                    {
                        name: `${root}/src/stories/select/Select.test.tsx`,
                        status: 'failed',
                        startTime: 1_100,
                        endTime: 1_200,
                        assertionResults: [
                            { title: 'a', status: 'passed' },
                            { title: 'b', status: 'failed' },
                        ],
                    },
                ],
            },
            root,
        );

        expect(summary.fail).toBe(1);
        expect(summary.fileResults[0]).toMatchObject({ component: 'select', failed: 1, status: 'fail' });
    });

    it('marks a suite that failed without any failing assertion', () => {
        // A `beforeAll` throw fails the file while every test reports as skipped.
        const summary = summarizeReport(
            {
                ...passingReport,
                testResults: [
                    {
                        name: `${root}/src/stories/drawer/Drawer.test.tsx`,
                        status: 'failed',
                        startTime: 1_100,
                        endTime: 1_150,
                        assertionResults: [{ title: 'a', status: 'skipped' }],
                    },
                ],
            },
            root,
        );

        expect(summary.fileResults[0].status).toBe('fail');
    });

    it('counts pending and todo tests as skipped', () => {
        const summary = summarizeReport({ ...passingReport, numPendingTests: 2, numTodoTests: 3 }, root);

        expect(summary.skipped).toBe(5);
    });

    it('returns zeros when the report is missing or malformed', () => {
        // Vitest can crash before writing a report; the comment step then falls
        // back to "View logs" instead of the step failing a second time.
        for (const bad of [null, undefined, {}, { testResults: 'nope' }]) {
            expect(summarizeReport(bad, root)).toMatchObject({ pass: 0, fail: 0, files: 0, duration: '0s' });
        }
    });
});

describe('componentFor', () => {
    it('extracts the component directory from a stories path', () => {
        expect(componentFor('src/stories/phoneinput/CountrySelect.test.tsx')).toBe('phoneinput');
    });

    it('falls back to the bare test name outside src/stories', () => {
        expect(componentFor('src/helpers/useControllableState.test.ts')).toBe('useControllableState');
        expect(componentFor('scripts/ciTestSummary.test.mjs')).toBe('ciTestSummary');
    });
});

describe('formatOutputs', () => {
    it('emits the keys the workflow reads, with file-results heredoc-delimited', () => {
        const outputs = formatOutputs(summarizeReport(passingReport, root));

        expect(outputs).toContain('total-pass=5');
        expect(outputs).toContain('total-files=2');
        // A bare `key=value` line would corrupt $GITHUB_OUTPUT if the JSON ever
        // contained a newline, so the blob is wrapped in a heredoc.
        expect(outputs).toMatch(/file-results<<(\w+)\n.*\n\1$/s);
        expect(JSON.parse(outputs.split('\n').at(-2))).toHaveLength(2);
    });
});
