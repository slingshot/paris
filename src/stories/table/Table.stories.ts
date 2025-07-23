import type { Meta, StoryObj } from '@storybook/nextjs';
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
    // @ts-expect-error
    args: {
        columns: [
            {
                title: 'Name',
            },
            {
                title: 'Role',
                hideBelow: 'sm',
            },
            {
                title: 'Email',
            },
        ],
        rows: [
            {
                id: 1,
                name: 'Mia Dolan',
                type: 'Actress',
                email: 'mia@slingshot.fm',
            },
            {
                id: 2,
                name: 'Sebastian Wilder',
                type: 'Artist',
                email: 'seb@slingshot.fm',
            },
            {
                id: 3,
                name: 'Amy Brandt',
                type: 'Casting',
                email: 'amy@slingshot.fm',
            },
        ],
        rowRenderFn: (row) => ({
            key: `${row.id}`,
            cells: [row.name, row.type, row.email],
        }),
        onRowClick: (row) => console.log('Row clicked', row),
    } satisfies TableProps<
        {
            id: number;
            name: string;
            type: string;
            email: string;
        }[]
    >,
};
