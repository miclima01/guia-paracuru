'use client';

import { useState, useEffect } from 'react';

export default function DebugAuthPage() {
    const [status, setStatus] = useState<any>(null);

    useEffect(() => {
        fetch('/api/auth/check')
            .then(res => res.json().then(data => ({ status: res.status, data })))
            .then(setStatus)
            .catch(err => setStatus({ error: err.message }));
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Auth Debug</h1>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(status, null, 2)}
            </pre>
            <div className="mt-4">
                <a href="/admin/login" className="text-blue-600 underline">Go to Login</a>
            </div>
        </div>
    );
}
