
'use client';

import { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { SuggestionModal } from './SuggestionModal';

export function SuggestionButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-carnival-500/30 hover:shadow-carnival-500/50 hover:scale-110 active:scale-95 transition-all duration-300 carnival-gradient text-white border-2 border-white/20"
                aria-label="Enviar sugestão"
            >
                <MessageSquareText size={28} className="drop-shadow-sm stroke-[2.5]" />
            </button>

            <SuggestionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
