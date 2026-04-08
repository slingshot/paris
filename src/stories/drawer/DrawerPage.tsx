'use client';

import type { ReactNode, ReactElement } from 'react';

/**
 * Props for a single drawer page in a paginated drawer.
 * Used with the DrawerPage component for a declarative API.
 *
 * Note: Props other than `children` are extracted by the parent Drawer component
 * and not directly used in rendering, which is why eslint may flag them as unused.
 */
export type DrawerPageProps<TPageID extends string = string> = {
    /**
     * Unique identifier for this page.
     * Must match one of the page IDs in the pagination state.
     */
    // eslint-disable-next-line react/no-unused-prop-types
    id: TPageID;
    /**
     * Page title (overrides Drawer title when this page is active).
     */
    // eslint-disable-next-line react/no-unused-prop-types
    title?: ReactNode;
    /**
     * Bottom panel content for this page.
     */
    // eslint-disable-next-line react/no-unused-prop-types
    bottomPanel?: ReactNode;
    /**
     * Additional actions shown in the title bar for this page.
     */
    // eslint-disable-next-line react/no-unused-prop-types
    additionalActions?: ReactNode;
    /**
     * The content of this page.
     */
    children: ReactNode;
};

/**
 * Component for defining a page in a paginated drawer.
 * Provides a declarative API for configuring page-specific properties.
 *
 * This component extracts its props and renders only its children.
 * The Drawer parent component processes the props to configure the page.
 *
 * @example
 * ```tsx
 * const pages = ['view', 'edit'] as const;
 * const pagination = usePagination<typeof pages>('view');
 *
 * <Drawer pagination={pagination}>
 *   <DrawerPage
 *     id="view"
 *     title="View User"
 *     bottomPanel={<Button onClick={() => pagination.open('edit')}>Edit</Button>}
 *   >
 *     <UserDetails />
 *   </DrawerPage>
 *
 *   <DrawerPage
 *     id="edit"
 *     title="Edit User"
 *     bottomPanel={<Button onClick={handleSave}>Save</Button>}
 *   >
 *     <UserForm />
 *   </DrawerPage>
 * </Drawer>
 * ```
 */
// eslint-disable-next-line react/no-unused-prop-types
export const DrawerPage = <TPageID extends string = string>({
    children,
}: DrawerPageProps<TPageID>): ReactElement => <>{children}</>;

// Type guard to check if a React element is a DrawerPage
export const isDrawerPageElement = (
    element: unknown,
): element is ReactElement<DrawerPageProps> => (
    element != null
    && typeof element === 'object'
    && 'type' in element
    && element.type === DrawerPage
);

/**
 * Extracted configuration from a DrawerPage component.
 * @internal
 */
export type DrawerPageConfig = {
    title?: ReactNode;
    bottomPanel?: ReactNode;
    additionalActions?: ReactNode;
};
