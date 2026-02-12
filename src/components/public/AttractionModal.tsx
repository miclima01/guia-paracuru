'use client';

import { Attraction } from '@/types';
import { useEffect } from 'react';
import { AttractionHeader } from './attraction-modal/AttractionHeader';
import { AttractionInfo } from './attraction-modal/AttractionInfo';
import { AttractionActions } from './attraction-modal/AttractionActions';

interface AttractionModalProps {
    attraction: Attraction | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AttractionModal({ attraction, isOpen, onClose }: AttractionModalProps) {
    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !attraction) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up flex flex-col"
                role="dialog"
                aria-modal="true"
            >
                <AttractionHeader attraction={attraction} onClose={onClose} />

                <AttractionInfo attraction={attraction} />

                <AttractionActions attraction={attraction} />
            </div>
        </div>
    );
}
