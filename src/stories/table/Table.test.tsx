import { render, screen } from '../../test/render';
import { Table } from './Table';

const columns = [{ title: 'Name' }, { title: 'Age' }, { title: 'Email' }];

const rows = [
    { name: 'Alice', age: 30, email: 'alice@example.com' },
    { name: 'Bob', age: 25, email: 'bob@example.com' },
    { name: 'Charlie', age: 35, email: 'charlie@example.com' },
];

describe('Table', () => {
    it('renders column headers', () => {
        render(<Table columns={columns} rows={rows} />);
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders row data using Object.values by default', () => {
        render(<Table columns={columns} rows={rows} />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
        expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    });

    it('renders all rows', () => {
        render(<Table columns={columns} rows={rows} />);
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('uses custom rowRenderFn', () => {
        render(
            <Table
                columns={[{ title: 'Full Info' }]}
                rows={rows}
                rowRenderFn={(row) => ({
                    key: row.name,
                    cells: [`${row.name} (${row.age})`],
                })}
            />,
        );
        expect(screen.getByText('Alice (30)')).toBeInTheDocument();
        expect(screen.getByText('Bob (25)')).toBeInTheDocument();
    });

    it('renders the table element', () => {
        const { container } = render(<Table columns={columns} rows={rows} />);
        expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('renders thead and tbody', () => {
        const { container } = render(<Table columns={columns} rows={rows} />);
        expect(container.querySelector('thead')).toBeInTheDocument();
        expect(container.querySelector('tbody')).toBeInTheDocument();
    });

    it('calls onRowClick when a row is clicked', async () => {
        const onRowClick = vi.fn();
        const { user } = render(<Table columns={columns} rows={rows} onRowClick={onRowClick} />);
        const aliceCell = screen.getByText('Alice');
        await user.click(aliceCell.closest('tr')!);
        expect(onRowClick).toHaveBeenCalledWith(rows[0]);
    });

    it('does not call onRowClick when clickableRows is false', async () => {
        const onRowClick = vi.fn();
        const { user } = render(<Table columns={columns} rows={rows} onRowClick={onRowClick} clickableRows={false} />);
        const aliceCell = screen.getByText('Alice');
        await user.click(aliceCell.closest('tr')!);
        expect(onRowClick).not.toHaveBeenCalled();
    });

    it('displays empty state when rows are empty', () => {
        render(<Table columns={columns} rows={[]} emptyState="No data available" />);
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('does not display empty state when there are rows', () => {
        render(<Table columns={columns} rows={rows} emptyState="No data available" />);
        expect(screen.queryByText('No data available')).not.toBeInTheDocument();
    });

    it('applies table className via overrides', () => {
        const { container } = render(
            <Table columns={columns} rows={rows} overrides={{ table: { className: 'custom-table' } }} />,
        );
        expect(container.querySelector('table')).toHaveClass('custom-table');
    });

    it('applies thead className via overrides', () => {
        const { container } = render(
            <Table columns={columns} rows={rows} overrides={{ thead: { className: 'custom-thead' } }} />,
        );
        expect(container.querySelector('thead')).toHaveClass('custom-thead');
    });

    it('applies tbody className via overrides', () => {
        const { container } = render(
            <Table columns={columns} rows={rows} overrides={{ tbody: { className: 'custom-tbody' } }} />,
        );
        expect(container.querySelector('tbody')).toHaveClass('custom-tbody');
    });

    it('applies clickable class to rows when clickableRows is true', () => {
        render(<Table columns={columns} rows={rows} clickableRows={true} />);
        const aliceRow = screen.getByText('Alice').closest('tr')!;
        expect(aliceRow).toHaveClass('clickable');
    });

    it('does not apply clickable class when clickableRows is false', () => {
        render(<Table columns={columns} rows={rows} clickableRows={false} />);
        const aliceRow = screen.getByText('Alice').closest('tr')!;
        expect(aliceRow).not.toHaveClass('clickable');
    });

    it('supports keyboard navigation on clickable rows', async () => {
        const onRowClick = vi.fn();
        const { user } = render(<Table columns={columns} rows={rows} onRowClick={onRowClick} />);
        const aliceRow = screen.getByText('Alice').closest('tr')!;
        aliceRow.focus();
        await user.keyboard('{Enter}');
        expect(onRowClick).toHaveBeenCalledWith(rows[0]);
    });

    it('handles hideBelow column property', () => {
        const columnsWithHide = [{ title: 'Name' }, { title: 'Age', hideBelow: 'md' as const }, { title: 'Email' }];
        const { container } = render(<Table columns={columnsWithHide} rows={rows} />);
        const ageHeader = screen.getByText('Age').closest('th');
        expect(ageHeader).toHaveClass('md');
    });

    it('renders empty state with colSpan matching column count', () => {
        const { container } = render(<Table columns={columns} rows={[]} emptyState="Empty" />);
        const td = container.querySelector('td[colspan]');
        expect(td).toHaveAttribute('colspan', String(columns.length));
    });

    it('renders ReactNode content in cells', () => {
        const richRows = [{ name: 'Alice', age: 30, email: 'alice@example.com' }];
        render(
            <Table
                columns={columns}
                rows={richRows}
                rowRenderFn={(row) => ({
                    key: row.name,
                    cells: [<strong key="name">{row.name}</strong>, String(row.age), row.email],
                })}
            />,
        );
        const strong = screen.getByText('Alice');
        expect(strong.tagName).toBe('STRONG');
    });
});
