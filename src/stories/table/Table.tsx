import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { useId, useMemo } from 'react';
import clsx from 'clsx';
import styles from './Table.module.scss';
import typography from '../text/Typography.module.css';

export type TableLineData = [NonNullable<ReactNode>, ...ReactNode[]];
export type RowRenderData = {
    key: string,
    cells: TableLineData,
};

export type TableProps<
    RowData extends Record<string, any> = Record<string, any>,
    HeaderNodeArray extends TableLineData = TableLineData,
> = {
    /**
     * The table headers. Must include at least one header.
     */
    headers: HeaderNodeArray;
    /**
     * The table rows, as an array of objects.
     */
    rows: RowData[];
    /**
     * A function that will be called for each row to compute the row's content. If omitted, the row will render the `Object.values` of the row data.
     *
     * The function should return an object containing a property named `key` for the row's React key (should be a unique id), and a property named `nodes` containing an array of React nodes to be rendered as cells in the row.
     * @param row - The data for the row being rendered.
     * @returns An object containing a property named `key` for the row's React key (should be a unique id), and a property named `nodes` containing an array of React nodes to be rendered as cells in the row.
     * @see RowRenderData
     */
    rowRenderFn?: (row: RowData) => RowRenderData;
    /**
     * A function that will be called when a row is clicked.
     * @param row - The data for the row being clicked.
     */
    onRowClick?: (row: RowData) => void | Promise<void>;
    /**
     * Whether the rows should be clickable.
     */
    clickableRows?: boolean;
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
export const Table: FC<TableProps> = ({
    headers,
    rows,
    rowRenderFn,
    onRowClick,
    clickableRows = true,
    overrides,
}) => {
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
                {...overrides?.trBody}
                className={clsx(
                    clickableRows && styles.clickable,
                    overrides?.trBody?.className,
                )}
            >
                {cells.map((cell) => (
                    <td
                        key={`${id}-cell-${cell.toString()}`}
                        {...overrides?.td}
                        className={clsx(
                            typography.paragraphXSmall,
                        )}
                    >
                        {cell}
                    </td>
                ))}
            </tr>
        ))
    ), [clickableRows, id, onRowClick, overrides?.td, overrides?.trBody, rows, rowsRenderData]);

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
                <tr {...overrides?.trHead}>
                    {headers.map((header) => (
                        <th
                            {...{
                                ...overrides?.th,
                                className: clsx(
                                    typography.labelXSmall,
                                ),
                            }}
                            key={`${id}-header-${header}`}
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody {...overrides?.tbody}>
                {renderedRows}
            </tbody>
        </table>
    );
};
