
'use client';

import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, User, MessageSquareText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SuggestionModal({ isOpen, onClose }: SuggestionModalProps) {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        setStatus('idle');

        try {
            const { error } = await supabase
                .from('suggestions')
                .insert([{ name, message, status: 'unread' }]);

            if (error) throw error;

            setStatus('success');
            setTimeout(() => {
                onClose();
                setName('');
                setMessage('');
                setStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Error submitting suggestion:', error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up ring-1 ring-black/5"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="p-6 pb-2 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-50 rounded-full transition-all"
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-display font-bold text-surface-900 mb-1">
                        Enviar Sugestão
                    </h2>

                </div>

                {/* Content */}
                <div className="p-6 pt-2">
                    {status === 'success' ? (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-green-100">
                                <CheckCircle2 size={40} className="drop-shadow-sm" />
                            </div>
                            <h3 className="text-xl font-bold text-surface-900 mb-2">Sucesso!</h3>
                            <p className="text-surface-600">Sua sugestão foi enviada. Obrigado!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">
                                    Seu Nome <span className="text-surface-400 font-normal normal-case">(Opcional)</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-carnival-500 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-surface-50 rounded-xl border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:bg-white focus:border-carnival-500 focus:ring-4 focus:ring-carnival-500/10 outline-none transition-all"
                                        placeholder="Como devemos te chamar?"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">
                                    Sua Sugestão <span className="text-carnival-500">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-4 text-surface-400 group-focus-within:text-carnival-500 transition-colors">
                                        <MessageSquareText size={18} />
                                    </div>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full pl-11 pr-4 py-3 bg-surface-50 rounded-xl border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:bg-white focus:border-carnival-500 focus:ring-4 focus:ring-carnival-500/10 outline-none transition-all resize-none"
                                        placeholder="Digita aqui sua ideia, crítica ou elogio..."
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                                    <AlertCircle size={18} />
                                    <span>Ops! Algo deu errado. Tente novamente.</span>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !message.trim()}
                                    className="w-full carnival-gradient hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-carnival-500/25 hover:shadow-carnival-500/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0 flex items-center justify-center gap-2 group"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Enviar agora
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
