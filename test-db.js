
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing connection...');
    const { data, error } = await supabase.from('transport_contacts').select('*').limit(1);
    if (error) {
        console.error('Error fetching transport_contacts:', error);
    } else {
        console.log('Success! Found', data.length, 'records.');
        console.log('Data:', data);
    }
}

test();
