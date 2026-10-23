import { PendingVisit } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import DialogContentText from '@mui/material/DialogContentText';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';

type Props = {
    /** Ask before leaving while this is true, e.g. when a form has unsaved changes. */
    when: boolean;
};

/**
 * Ask for confirmation before leaving the page, both for Inertia links and for closing or reloading the tab.
 * Only page navigations (GET visits) are guarded, so form submits and file uploads go through as usual.
 */
const LeavePageConfirmation = ({ when }: Props) => {
    const { t } = useTranslation();
    const [pendingVisit, setPendingVisit] = useState<PendingVisit | null>(null);
    const isLeavingRef = useRef(false);

    useEffect(() => {
        if (!when) return;

        const removeBeforeListener = router.on('before', (event) => {
            const { visit } = event.detail;

            if (isLeavingRef.current || visit.method !== 'get') return;

            setPendingVisit(visit);

            return false;
        });

        // Closing or reloading the tab can only show the browser's own dialog.
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            removeBeforeListener();
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [when]);

    const handleLeave = () => {
        if (!pendingVisit) return;

        isLeavingRef.current = true;
        router.visit(pendingVisit.url, {
            method: pendingVisit.method,
            replace: pendingVisit.replace,
            preserveScroll: pendingVisit.preserveScroll,
            preserveState: pendingVisit.preserveState,
            onFinish: () => (isLeavingRef.current = false),
        });
        setPendingVisit(null);
    };

    return (
        <Modal
            open={!!pendingVisit}
            onClose={() => setPendingVisit(null)}
            onOk={handleLeave}
            title={t('confirmation')}
            okText={t('leave_page')}
            closeText={t('stay_on_page')}
        >
            <DialogContentText>{t('leave_page_confirmation')}</DialogContentText>
        </Modal>
    );
};

export default LeavePageConfirmation;
