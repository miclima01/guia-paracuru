import Link from 'next/link';
import { Home, MapPin } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-surface-50">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-carnival-100 rounded-full flex items-center justify-center mx-auto mb-6 text-carnival-600 animate-bounce">
                    <MapPin size={48} />
                </div>
                <h1 className="font-display text-4xl text-surface-900 mb-2">Ops!</h1>
                <h2 className="font-display text-2xl text-surface-700 mb-4">Página não encontrada</h2>
                <p className="text-surface-500 mb-8">
                    Parece que você se perdeu no bloquinho. A página que você está procurando não existe ou foi movida.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-carnival-600 text-white font-bold hover:bg-carnival-700 transition-colors shadow-lg active:scale-95"
                >
                    <Home size={18} />
                    Voltar para Home
                </Link>
            </div>
        </div>
    );
}
