'use client';

import {
    createContext,
    type ReactNode,
    type RefObject,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';

export type BottomPanelEntry = {
    id: string;
    mode: 'replace' | 'append';
    priority: number;
};

export type DrawerSlotContextValue = {
    titleRef: RefObject<HTMLDivElement | null>;
    actionsRef: RefObject<HTMLDivElement | null>;
    bottomPanelRef: RefObject<HTMLDivElement | null>;
    /** Callback ref for the bottom panel portal target — triggers re-render when assigned */
    bottomPanelCallbackRef: (node: HTMLDivElement | null) => void;
    /** Whether the bottom panel portal target is mounted in the DOM */
    isBottomPanelMounted: boolean;

    hasTitleSlot: boolean;
    hasActionsSlot: boolean;

    /** Whether a replace-mode bottom panel is registered */
    hasBottomPanelReplace: boolean;
    /** Whether any bottom panel slot (replace or append) is registered */
    hasAnyBottomPanelSlot: boolean;
    /** Sorted list of append-mode bottom panel entries */
    bottomPanelAppendEntries: BottomPanelEntry[];

    registerTitleSlot: () => () => void;
    registerActionsSlot: () => () => void;
    registerBottomPanel: (entry: BottomPanelEntry) => () => void;
};

const DrawerSlotContext = createContext<DrawerSlotContextValue | null>(null);

export function useDrawerSlotContext(): DrawerSlotContextValue | null {
    return useContext(DrawerSlotContext);
}

export function DrawerSlotProvider({ children }: { children: ReactNode }) {
    const titleRef = useRef<HTMLDivElement | null>(null);
    const actionsRef = useRef<HTMLDivElement | null>(null);
    const bottomPanelRef = useRef<HTMLDivElement | null>(null);
    const [isBottomPanelMounted, setIsBottomPanelMounted] = useState(false);

    const bottomPanelCallbackRef = useCallback((node: HTMLDivElement | null) => {
        bottomPanelRef.current = node;
        setIsBottomPanelMounted(node !== null);
    }, []);

    const [titleSlotCount, setTitleSlotCount] = useState(0);
    const [actionsSlotCount, setActionsSlotCount] = useState(0);
    const [bottomPanelEntries, setBottomPanelEntries] = useState<BottomPanelEntry[]>([]);

    const registerTitleSlot = useCallback((): (() => void) => {
        setTitleSlotCount((prev) => {
            const next = prev + 1;
            if (process.env.NODE_ENV === 'development' && next > 1) {
                console.warn(
                    'DrawerSlotContext: Multiple title slots registered simultaneously. Only one is expected.',
                );
            }
            return next;
        });
        return () => {
            setTitleSlotCount((prev) => Math.max(0, prev - 1));
        };
    }, []);

    const registerActionsSlot = useCallback((): (() => void) => {
        setActionsSlotCount((prev) => {
            const next = prev + 1;
            if (process.env.NODE_ENV === 'development' && next > 1) {
                console.warn(
                    'DrawerSlotContext: Multiple actions slots registered simultaneously. Only one is expected.',
                );
            }
            return next;
        });
        return () => {
            setActionsSlotCount((prev) => Math.max(0, prev - 1));
        };
    }, []);

    const registerBottomPanel = useCallback((entry: BottomPanelEntry): (() => void) => {
        setBottomPanelEntries((prev) => {
            if (process.env.NODE_ENV === 'development' && entry.mode === 'replace') {
                const existingReplace = prev.find((e) => e.mode === 'replace');
                if (existingReplace) {
                    console.warn(
                        `DrawerSlotContext: Multiple replace-mode bottom panels registered (existing: "${existingReplace.id}", new: "${entry.id}"). Only one replace-mode panel is expected.`,
                    );
                }
            }
            return [...prev, entry];
        });
        return () => {
            setBottomPanelEntries((prev) => prev.filter((e) => e.id !== entry.id));
        };
    }, []);

    const hasTitleSlot = titleSlotCount > 0;
    const hasActionsSlot = actionsSlotCount > 0;
    const hasBottomPanelReplace = bottomPanelEntries.some((e) => e.mode === 'replace');
    const hasAnyBottomPanelSlot = bottomPanelEntries.length > 0;
    const bottomPanelAppendEntries = useMemo(
        () => bottomPanelEntries.filter((e) => e.mode === 'append').sort((a, b) => a.priority - b.priority),
        [bottomPanelEntries],
    );

    const value = useMemo<DrawerSlotContextValue>(
        () => ({
            titleRef,
            actionsRef,
            bottomPanelRef,
            bottomPanelCallbackRef,
            isBottomPanelMounted,
            hasTitleSlot,
            hasActionsSlot,
            hasBottomPanelReplace,
            hasAnyBottomPanelSlot,
            bottomPanelAppendEntries,
            registerTitleSlot,
            registerActionsSlot,
            registerBottomPanel,
        }),
        [
            bottomPanelCallbackRef,
            isBottomPanelMounted,
            hasTitleSlot,
            hasActionsSlot,
            hasBottomPanelReplace,
            hasAnyBottomPanelSlot,
            bottomPanelAppendEntries,
            registerTitleSlot,
            registerActionsSlot,
            registerBottomPanel,
        ],
    );

    return <DrawerSlotContext.Provider value={value}>{children}</DrawerSlotContext.Provider>;
}
