'use client';

import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import type { BottomPanelMode } from './DrawerBottomPanelContext';
import { useDrawerBottomPanel } from './DrawerBottomPanelContext';
import { useIsDrawerPageActive } from './DrawerPageContext';

export type DrawerBottomPanelPortalProps = {
    /**
     * The content to render in the drawer's bottom panel.
     */
    children: ReactNode;
    /**
     * How to combine with existing bottom panel content:
     * - 'replace': Replace entire bottom panel (default)
     * - 'append': Add after existing content
     * - 'prepend': Add before existing content
     *
     * @default 'replace'
     */
    mode?: BottomPanelMode;
    /**
     * Only activate portal when this condition is true.
     * Useful for pagination where multiple portals exist but only one should be active.
     *
     * @default true
     */
    when?: boolean;
};

/**
 * Portal component to render content into the drawer's bottom panel.
 * Can be used anywhere within a Drawer's children tree.
 *
 * This provides a clean way for child components to inject content
 * into the drawer's bottom panel without prop drilling, which is especially
 * useful when page components are defined in separate files.
 *
 * **Pagination Support:**
 * When used with paginated drawers, the portal automatically detects which
 * page is active and only renders content from the currently visible page.
 * All pages remain mounted (for animation purposes), but only the active
 * page's portal content is displayed.
 *
 * @example
 * // Separate component file
 * const SaveForm = () => {
 *   const handleSubmit = async () => { ... };
 *   const [isSubmitting, setIsSubmitting] = useState(false);
 *
 *   return (
 *     <>
 *       <div className="form-fields">
 *         <Input label="Name" />
 *         <Input label="Email" />
 *       </div>
 *
 *       <DrawerBottomPanelPortal>
 *         <Button onClick={handleSubmit} loading={isSubmitting}>
 *           Save Changes
 *         </Button>
 *       </DrawerBottomPanelPortal>
 *     </>
 *   );
 * };
 *
 * // In parent component
 * <Drawer pagination={pagination}>
 *   <div key="edit"><SaveForm /></div>
 *   <div key="review"><ReviewForm /></div>
 * </Drawer>
 *
 * @throws Error if used outside a Drawer component
 */
export const DrawerBottomPanelPortal: FC<DrawerBottomPanelPortalProps> = ({
    children,
    mode = 'replace',
    when,
}) => {
    const { setPortalContent } = useDrawerBottomPanel();
    const isPageActive = useIsDrawerPageActive();

    // Use explicit when prop if provided, otherwise use page active state
    const isActive = when !== undefined ? when : isPageActive;

    useEffect(() => {
        if (!isActive) {
            // Don't set content when inactive
            return undefined;
        }

        // Set content when active
        setPortalContent(children, mode);

        // Clear when this effect re-runs or component unmounts
        return () => {
            setPortalContent(null);
        };
    }, [children, mode, isActive, setPortalContent]);

    // Renders nothing in place - content is portaled to bottom panel
    return null;
};
