/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

if (!process.argv[2]) {
    console.error('❌  Please provide a component name, e.g. yarn run create:component Button');
    process.exit(1);
}

const componentNameInput = process.argv[2];

if (!/[A-Za-z]+/.test(componentNameInput)) {
    console.error('❌  Please provide a alphabet only component name in CamelCase, e.g. yarn run create:component Button');
    process.exit(1);
}

// Capitalize the first letter of the component name
const componentName = componentNameInput.charAt(0).toUpperCase() + componentNameInput.slice(1);

const baseDir = path.resolve(process.cwd());
const componentDirectory = `${baseDir}/src/stories/${componentName.toLocaleLowerCase()}`;

const componentFile = `${componentDirectory}/${componentName}.tsx`;
const cssModuleFile = `${componentDirectory}/${componentName}.module.css`;
const storyFile = `${componentDirectory}/${componentName}.stories.ts`;
const indexFile = `${componentDirectory}/index.ts`;

const componentCode = `import type { FC } from 'react';
import styles from './${componentName}.module.css';

export type ${componentName}Props = {
    /** Add props here */
    content?: string;
};

export const ${componentName}: FC<${componentName}Props> = ({ content }) => (
    <div>
        <p className={styles.content}>{content || 'Replace this area with your component.'}</p>
    </div>
);
`;

const indexCode = `export * from './${componentName}';
`;

const cssModuleCode = `.content {
    color: red;
}
`;

const storyCode = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
    title: '${componentName}',
    component: ${componentName},
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
    args: {
        content: 'Hello world! This is a new ${componentName} component.',
    },
};

export const Secondary: Story = {
    args: {
        content: 'Hello world! This is a secondary component.',
    },
};
`;

const run = async () => {
    const componentExists = await fs.promises
        .access(indexFile)
        .then(() => true)
        .catch(() => false);

    if (componentExists) {
        throw new Error(`❌  Component ${componentName} already exists.`);
    }

    const success = await fs.promises.mkdir(componentDirectory)
        .then(() => Promise.all([
            fs.promises.writeFile(componentFile, componentCode, { encoding: 'utf8' }),
            fs.promises.writeFile(cssModuleFile, cssModuleCode, { encoding: 'utf8' }),
            fs.promises.writeFile(storyFile, storyCode, { encoding: 'utf8' }),
            fs.promises.writeFile(indexFile, indexCode, { encoding: 'utf8' }),
        ]))
        .then(() => `✅  Component ${componentName} created!`);

    return success;
};

run().then(console.log).catch(console.error);
