import type { Meta, StoryObj } from '@storybook/react';
import type { TableProps } from './Table';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
    title: 'Content/Table',
    component: Table,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
    args: {
        headers: [
            'Name',
            'Type',
            'Email',
        ],
        rows: [
            {
                id: 1,
                name: 'Billie Eilish',
                type: 'Artist',
                email: 'billie@slingshot.fm',
            },
            {
                id: 2,
                name: 'Taylor Swift',
                type: 'Artist',
                email: 'taylor@slingshot.fm',
            },
            {
                id: 3,
                name: 'Valkyrae',
                type: 'Creator',
                email: 'valkyrae@slingshot.fm',
            },
        ],
        rowRenderFn: (row) => ({
            key: `${row.id}`,
            cells: [row.name, row.type, row.email],
        }),
        onRowClick: (row) => console.log('Row clicked', row),
    } satisfies TableProps,
};
