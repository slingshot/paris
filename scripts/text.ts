#!/usr/bin/env ts-node --esm

/**
 * @file Generates CSS modules and Storybook stories for typography classes.
 */

import fs from 'fs/promises';
import * as cp from 'child_process';
import jss from 'jss';
import preset from 'jss-preset-default';
import type { StoryObj } from '@storybook/nextjs';
import { pascalCase } from 'change-case';
import type { FontDefinition, Theme } from '../src/stories/theme';
import { theme, pvar, LightTheme } from '../src/stories/theme';
import type { Text } from '../src/stories/text';

jss.setup({
    ...preset(),
    createGenerateId: () => (rule) => rule.key,
});

/**
 * Generates a CSS module with all the typography classes.
 */
export const text = async () => {
    const styles = Object.fromEntries((Object.entries(theme.typography.styles) as Array<[keyof Theme['typography']['styles'], FontDefinition]>)
        .map(([fontClass, value]) => [
            fontClass,
            Object.fromEntries((Object.keys(value) as Array<keyof FontDefinition>).map((attr) => [
                attr,
                pvar(`typography.styles.${fontClass}.${attr}`),
            ])),
        ]));
    // const { styles } = theme.typography;
    const css = `/* Auto-generated with \`pnpm generate:text\` on ${new Date().toString()} */\n/* Do not edit manually; instead, edit the \`generateTextClasses\` function in \`scripts/text.ts\` and run \`pnpm generate:text -c\`. */\n\n${jss.createStyleSheet(styles).toString()}`;
    await fs.writeFile('src/stories/text/Typography.module.css', css
        // Add a newline after each class
        .replaceAll('}', '}\n'));
};

/**
 * Generates Storybook stories for each typography class.
 */
export const generateTextStories = async () => {
    const typographyStories: Array<[string, StoryObj<typeof Text>]> = Object.keys(LightTheme.typography.styles)
        .map((style) => ([
            style,
            {
                args: {
                    children: 'In an alleyway, drinking champagne',
                    kind: style,
                },
            } as StoryObj<typeof Text>,
        ]));

    const styledStories: Array<[string, StoryObj<typeof Text>]> = [
        ['paragraphLargeBold', { args: { children: 'In an alleyway, drinking champagne', kind: 'paragraphLarge', weight: 'medium' } }],
        ['paragraphMediumBold', { args: { children: 'In an alleyway, drinking champagne', kind: 'paragraphMedium', weight: 'medium' } }],
        ['paragraphSmallBold', { args: { children: 'In an alleyway, drinking champagne', kind: 'paragraphSmall', weight: 'medium' } }],
        ['paragraphXSmallBold', { args: { children: 'In an alleyway, drinking champagne', kind: 'paragraphXSmall', weight: 'medium' } }],
        ['paragraphLargeItalic', { args: { children: 'In an alleyway, drinking champagne', kind: 'paragraphLarge', fontStyle: 'italic' } }],
    ];

    const stories = [...typographyStories, ...styledStories];

    // Retrieve current stories
    const currentStories = await fs.readFile('src/stories/text/Text.stories.ts', 'utf-8');

    // Look for `// @auto-generated-start` and `// @auto-generated-end`
    const start = currentStories.indexOf('// @auto-generated-start');
    const end = currentStories.indexOf('// @auto-generated-end');

    // Generate the new stories
    const out = stories.map((story) => `export const ${pascalCase(story[0]).replace('Xx', 'XX')}: Story = ${JSON.stringify(story[1], null, 4)};`).join('\n\n');

    // If the start and end tags are found, replace the content between them
    if (start !== -1 && end !== -1) {
        const newStories = `${currentStories.slice(0, start + '// @auto-generated-start\n\n'.length)}${
            out
        }\n\n${
            currentStories.slice(end)}`;
        await fs.writeFile('src/stories/text/Text.stories.ts', newStories);
    } else {
    // Otherwise, append the new stories to the end of the file and add the start and end tags
        const newStories = `${currentStories
        }\n\n// @auto-generated-start\n\n${
            out
        }\n\n// @auto-generated-end`;
        await fs.writeFile('src/stories/text/Text.stories.ts', newStories);
    }

    // const storyFile = stories.map((story) => `export const ${pascalCase(story.storyName as string)}: Story = ${JSON.stringify(story, null, 4)};`).join('\n\n');
    // await fs.writeFile('src/stories/text/Text.generated-stories.ts', storyFile);
};

(async function main() {
    let argReceived = false;
    if (process.argv.includes('--stories') || process.argv.includes('-s')) {
        const startS = Date.now();
        argReceived = true;
        await generateTextStories();
        try {
            cp.execSync('eslint --fix src/stories/text/Text.stories.ts');
        } catch (e: any) {
            console.error('❌   Failed to lint generated stories.');
            if (e?.stdout) {
                console.error(e?.stdout?.toString());
            }
            process.exit(1);
        }
        console.info(`✅   Successfully generated stories in ${Date.now() - startS}ms`);
    }
    if (process.argv.includes('--classes') || process.argv.includes('-c')) {
        const startC = Date.now();
        argReceived = true;
        await text();
        console.info(`✅   Successfully generated classes in ${Date.now() - startC}ms`);
    }
    if (!argReceived) {
        console.error('❌   No arguments received. Please specify either --stories, --classes, or both.');
        process.exit(1);
    }
    process.exit(0);
}());
