'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useId, useMemo } from 'react';
import clsx from 'clsx';
import styles from './Table.module.scss';
import typography from '../text/Typography.module.css';

export type TableLineData = [NonNullable<ReactNode>, ...ReactNode[]];
export type RowRenderData = {
    key: string,
    cells: TableLineData,
};
/**
 * The data for a column in a table.
 */
export type ColumnData = {
    /**
     * The column's header.
     */
    title: NonNullable<ReactNode>;
    /**
     * The breakpoint at which the column should be hidden. If omitted, the column will always be visible.
     */
    hideBelow?: 'sm' | 'md' | 'lg' | 'xl';
};

export type TableProps<
    RowData extends Record<string, any>[],
    // HeaderNodeArray extends TableLineData = TableLineData,
> = {
    /**
     * The table headers. Must include at least one header.
     */
    columns: ColumnData[];
    /**
     * The table rows, as an array of objects.
     */
    rows: RowData;
    /**
     * A function that will be called for each row to compute the row's content. If omitted, the row will render the `Object.values` of the row data.
     *
     * The function should return an object containing a property named `key` for the row's React key (should be a unique id), and a property named `nodes` containing an array of React nodes to be rendered as cells in the row.
     * @param row - The data for the row being rendered.
     * @returns An object containing a property named `key` for the row's React key (should be a unique id), and a property named `cells` containing an array of React nodes to be rendered as cells in the row.
     * @see RowRenderData
     */
    rowRenderFn?: (row: RowData[number]) => RowRenderData;
    /**
     * A function that will be called when a row is clicked.
     * @param row - The data for the row being clicked.
     */
    onRowClick?: (row: RowData[number]) => void | Promise<void>;
    /**
     * Whether the rows should be clickable.
     */
    clickableRows?: boolean;

    /**
     * The content to display when the table is empty.
     */
    emptyState?: ReactNode;
    /**
     * Prop overrides for rendered elements.
     */
    overrides?: {
        table?: ComponentPropsWithoutRef<'table'>;
        thead?: ComponentPropsWithoutRef<'thead'>;
        tbody?: ComponentPropsWithoutRef<'tbody'>;
        trHead?: ComponentPropsWithoutRef<'tr'>;
        th?: ComponentPropsWithoutRef<'th'>;
        trBody?: ComponentPropsWithoutRef<'tr'>;
        td?: ComponentPropsWithoutRef<'td'>;
    }
};

/**
 * A Table component.
 *
 * <hr />
 *
 * To use this component, import it as follows:
 *
 * ```js
 * import { Table } from 'paris/table';
 * ```
 * @constructor
 */
export function Table<RowData extends Record<string, any>[]>({
    columns,
    rows,
    rowRenderFn,
    onRowClick,
    clickableRows = true,
    emptyState,
    overrides,
}: TableProps<RowData>) {
    const id = useId();
    const rowsRenderData = useMemo(() => (
        rows.map(
            rowRenderFn
            ?? ((row) => ({
                key: Object.values(row).join('-'),
                cells: Object.values(row),
            })),
        )
    ), [rows, rowRenderFn]);

    const renderedRows = useMemo(() => (
        rowsRenderData.map(({ key, cells }, index) => (
            <tr
                key={`${id}-row-${key}`}
                onClick={() => {
                    if (clickableRows) onRowClick?.(rows[index]);
                }}
                onKeyDown={(e) => {
                    if (clickableRows && (e.key === 'Enter' || e.key === ' ')) onRowClick?.(rows[index]);
                }}
                tabIndex={clickableRows ? 0 : undefined}
                {...overrides?.trBody}
                className={clsx(
                    clickableRows && styles.clickable,
                    overrides?.trBody?.className,
                )}
            >
                {cells.map((cell, i) => (
                    <td
                        key={`${id}-cell-${key}-${columns[i].title}`}
                        {...overrides?.td}
                        className={clsx(
                            typography.paragraphXSmall,
                            styles[columns[i].hideBelow ?? ''],
                            overrides?.td?.className,
                        )}
                    >
                        {cell}
                    </td>
                ))}
            </tr>
        ))
    ), [clickableRows, columns, id, onRowClick, overrides?.td, overrides?.trBody, rows, rowsRenderData]);

    return (
        <table
            {...{
                ...overrides?.table,
                className: clsx(
                    styles.table,
                    overrides?.table?.className,
                ),
            }}
        >
            <thead {...overrides?.thead}>
                <tr {...overrides?.trHead} className={styles.tableHeader}>
                    {columns.map((column) => (
                        <th
                            {...{
                                ...overrides?.th,
                                className: clsx(
                                    typography.labelXSmall,
                                    styles[column.hideBelow ?? ''],
                                    overrides?.th?.className,
                                ),
                            }}
                            key={`${id}-header-${column.title.toString()}`}
                        >
                            {column.title}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody {...overrides?.tbody}>
                {renderedRows.length === 0 && emptyState && (
                    <>
                        <tr className={styles.empty}>
                            <td colSpan={columns.length} className={styles.emptyState}>
                                {emptyState}
                            </td>
                        </tr>
                    </>
                )}
                {renderedRows}
            </tbody>
        </table>
    );
}
