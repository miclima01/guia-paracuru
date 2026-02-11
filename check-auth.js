
async function check() {
    try {
        console.log('Fetching http://127.0.0.1:3000/api/auth/check ...');
        const res = await fetch('http://127.0.0.1:3000/api/auth/check');
        console.log('Status:', res.status);
        const txt = await res.text();
        console.log('Body:', txt);
    } catch (e) {
        console.error('Error:', e);
    }
}
check();
