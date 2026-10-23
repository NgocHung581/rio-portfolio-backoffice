import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box, { BoxProps } from '@mui/material/Box';
import { ReactNode, RefObject, useLayoutEffect, useRef, useState } from 'react';
import Draggable, { DraggableProps } from 'react-draggable';

const GROUP_ATTRIBUTE = 'data-sortable-group';
const HANDLE_ATTRIBUTE = 'data-sortable-handle';
const TRANSITION = 'transform 200ms cubic-bezier(0.2, 0, 0, 1)';
const CONTENT_TRANSITION = `${TRANSITION}, box-shadow 200ms`;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const getTransition = (transition: string) => (window.matchMedia(REDUCED_MOTION_QUERY).matches ? 'none' : transition);

type Props = {
    group: string;
    index: number;
    onSort: (fromIndex: number, toIndex: number) => void;
    axis?: DraggableProps['axis'];
    disabled?: boolean;
    children: ReactNode;
} & Omit<BoxProps, 'ref' | 'children'>;

type DragSession = {
    items: HTMLElement[];
    rects: DOMRect[];
    scroll: { x: number; y: number };
    targetIndex: number;
};

export const moveArrayItem = <T,>(items: T[], fromIndex: number, toIndex: number): T[] => {
    const result = [...items];
    const [movedItem] = result.splice(fromIndex, 1);

    result.splice(toIndex, 0, movedItem);

    return result;
};

export const SortableHandle = ({ group, disabled }: { group: string; disabled?: boolean }) => (
    <Box
        {...{ [HANDLE_ATTRIBUTE]: group }}
        component="span"
        display="inline-flex"
        color="text.secondary"
        sx={{ cursor: disabled ? 'not-allowed' : 'grab', touchAction: 'none', '&:active': { cursor: 'grabbing' } }}
    >
        <DragIndicatorIcon />
    </Box>
);

const containsPoint = (rect: DOMRect, x: number, y: number) =>
    x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

/**
 * Sort items in the same `group` by dragging its `SortableHandle`.
 * While dragging, the other items shift to preview the new order; `onSort` is called on drop.
 */
const SortableItem = ({ group, index, onSort, axis = 'both', disabled, children, sx, ...boxProps }: Props) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const sessionRef = useRef<DragSession | null>(null);
    const droppedRectRef = useRef<DOMRect | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Animate the dropped item from where it was released to its new slot (FLIP).
    useLayoutEffect(() => {
        const droppedRect = droppedRectRef.current;
        const node = nodeRef.current;
        const content = contentRef.current;

        if (!droppedRect || !node || !content) return;

        droppedRectRef.current = null;

        const rect = node.getBoundingClientRect();

        content.style.transition = 'none';
        content.style.transform = `translate(${droppedRect.left - rect.left}px, ${droppedRect.top - rect.top}px)`;
        content.getBoundingClientRect();
        content.style.transition = getTransition(CONTENT_TRANSITION);
        content.style.transform = '';
    });

    const shiftSiblings = (session: DragSession) => {
        const { items, rects, targetIndex } = session;
        const draggedRect = rects[index];
        const gap = rects.length > 1 ? rects[1].top - rects[0].bottom : 0;

        items.forEach((item, itemIndex) => {
            if (itemIndex === index) return;

            const isAfterMovingDown = itemIndex > index && itemIndex <= targetIndex;
            const isBeforeMovingUp = itemIndex < index && itemIndex >= targetIndex;

            if (!isAfterMovingDown && !isBeforeMovingUp) {
                item.style.transform = '';

                return;
            }

            const direction = isAfterMovingDown ? -1 : 1;

            if (axis === 'y') {
                item.style.transform = `translateY(${direction * (draggedRect.height + gap)}px)`;

                return;
            }

            const neighborRect = rects[itemIndex + direction];

            item.style.transform = `translate(${neighborRect.left - rects[itemIndex].left}px, ${
                neighborRect.top - rects[itemIndex].top
            }px)`;
        });
    };

    const handleStart = () => {
        const items = Array.from(document.querySelectorAll<HTMLElement>(`[${GROUP_ATTRIBUTE}="${group}"]`));

        items.forEach((item) => {
            if (item !== nodeRef.current) item.style.transition = getTransition(TRANSITION);
        });

        sessionRef.current = {
            items,
            rects: items.map((item) => item.getBoundingClientRect()),
            scroll: { x: window.scrollX, y: window.scrollY },
            targetIndex: index,
        };
        setIsDragging(true);
    };

    const handleDrag = () => {
        const session = sessionRef.current;
        const node = nodeRef.current;

        if (!session || !node) return;

        const rect = node.getBoundingClientRect();
        // Compare in the coordinates captured at drag start, so scrolling while dragging still works.
        const centerX = rect.left + rect.width / 2 + window.scrollX - session.scroll.x;
        const centerY = rect.top + rect.height / 2 + window.scrollY - session.scroll.y;
        const hoveredIndex = session.rects.findIndex((itemRect) => containsPoint(itemRect, centerX, centerY));
        const isInsideList =
            session.rects.some((itemRect) => centerX >= itemRect.left && centerX <= itemRect.right) &&
            session.rects.some((itemRect) => centerY >= itemRect.top && centerY <= itemRect.bottom);
        // Keep the last target while hovering the gaps between items, reset when leaving the list.
        const targetIndex = hoveredIndex !== -1 ? hoveredIndex : isInsideList ? session.targetIndex : index;

        if (targetIndex === session.targetIndex) return;

        session.targetIndex = targetIndex;
        shiftSiblings(session);
    };

    const handleStop = () => {
        const session = sessionRef.current;

        sessionRef.current = null;

        if (nodeRef.current) droppedRectRef.current = nodeRef.current.getBoundingClientRect();

        session?.items.forEach((item) => {
            item.style.transition = '';
            item.style.transform = '';
        });
        setIsDragging(false);

        if (session && session.targetIndex !== index) onSort(index, session.targetIndex);
    };

    return (
        <Draggable
            nodeRef={nodeRef as RefObject<HTMLElement>}
            axis={axis}
            handle={`[${HANDLE_ATTRIBUTE}="${group}"]`}
            position={{ x: 0, y: 0 }}
            disabled={disabled}
            onStart={handleStart}
            onDrag={handleDrag}
            onStop={handleStop}
        >
            <Box
                ref={nodeRef}
                {...{ [GROUP_ATTRIBUTE]: group }}
                {...boxProps}
                sx={{ position: 'relative', ...(isDragging && { zIndex: 10 }), ...sx }}
            >
                <Box
                    ref={contentRef}
                    height={1}
                    sx={{
                        borderRadius: 1,
                        transition: CONTENT_TRANSITION,
                        [`@media ${REDUCED_MOTION_QUERY}`]: { transition: 'none' },
                        ...(isDragging && { transform: 'scale(1.02)', boxShadow: 8, opacity: 0.9 }),
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Draggable>
    );
};

export default SortableItem;
