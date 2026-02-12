'use server';

import { createAdminClient } from '@/lib/supabase';
import { isAdmin } from '@/lib/admin-auth';

// Helper to ensure user is admin
async function ensureAdmin() {
    const isAuth = await isAdmin();
    if (!isAuth) {
        throw new Error('Unauthorized');
    }
}

export async function getAdminItems(table: string, options?: { orderBy?: { column: string; ascending?: boolean }; filter?: { column: string; value: string | number | boolean } }) {
    await ensureAdmin();
    const supabase = createAdminClient();

    let query = supabase.from(table).select('*');

    if (options?.filter) {
        query = query.eq(options.filter.column, options.filter.value);
    }

    if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true,
        });
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createAdminItem(table: string, data: Record<string, unknown>) {
    await ensureAdmin();
    const supabase = createAdminClient();

    const { data: newItem, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return newItem;
}

export async function updateAdminItem(table: string, id: string, data: Record<string, unknown>) {
    await ensureAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function deleteAdminItem(table: string, id: string) {
    await ensureAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function getDashboardStats() {
    await ensureAdmin();
    const supabase = createAdminClient();

    const [attractions, news, businesses, payments] = await Promise.all([
        supabase.from('attractions').select('id', { count: 'exact', head: true }),
        supabase.from('news').select('id', { count: 'exact', head: true }),
        supabase.from('businesses').select('id', { count: 'exact', head: true }),
        supabase.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    ]);

    return {
        attractions: attractions.count || 0,
        news: news.count || 0,
        businesses: businesses.count || 0,
        payments: payments.count || 0,
    };
}

export async function getSettings() {
    // Public read is allowed, but for admin page we might want to ensure consistency or use admin client
    // effectively bypassing RLS if needed, or just standard read.
    // The policy "Public read settings" exists, so public client works too.
    // However, using server action keeps logic consistent.
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('app_settings').select('*');

    if (error) throw new Error(error.message);

    const settingsMap: Record<string, string> = {};
    if (data) {
        data.forEach((item) => {
            settingsMap[item.key] = item.value;
        });
    }
    return settingsMap;
}

export async function saveSettings(values: Record<string, string>) {
    await ensureAdmin();
    const supabase = createAdminClient();

    // Determine if we should use upsert for each or a bulk operation if possible.
    // Supabase upsert can take an array.
    const updates = Object.entries(values).map(([key, value]) => ({
        key,
        value
    }));

    if (updates.length === 0) return;

    const { error } = await supabase
        .from('app_settings')
        .upsert(updates, { onConflict: 'key' });

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function uploadHeroImage(formData: FormData, key: string = 'hero_background_image'): Promise<string> {
    await ensureAdmin();

    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('Nenhum arquivo fornecido');
    }

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Formato inválido. Use JPG, PNG ou WebP');
    }

    // Validar tamanho (máx 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. Máximo 5MB');
    }

    const supabase = createAdminClient();

    // Deletar imagem anterior se existir
    const { data: currentSetting } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (currentSetting?.value?.includes('/storage/v1/object/public/media/')) {
        // Extrair path da URL antiga e deletar
        const oldPath = currentSetting.value.split('/media/')[1];
        if (oldPath) {
            await supabase.storage.from('media').remove([oldPath]);
        }
    }

    // Upload nova imagem
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    // Sanitize key for filename
    const safeKey = key.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const fileName = `hero/${safeKey}-${timestamp}.${ext}`;

    const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw new Error(error.message);
    }

    // Retornar URL pública
    const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

    return publicUrl;
}

export async function uploadImage(formData: FormData, folder: string = 'ads'): Promise<string> {
    await ensureAdmin();

    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('Nenhum arquivo fornecido');
    }

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Formato inválido. Use JPG, PNG ou WebP');
    }

    // Validar tamanho (máx 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('Arquivo muito grande. Máximo 5MB');
    }

    const supabase = createAdminClient();
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw new Error(error.message);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

    return publicUrl;
}

export async function getAdvertisements() {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function createAdvertisement(data: Record<string, unknown>) {
    await ensureAdmin();
    const supabase = createAdminClient();

    // Get max order_index
    const { data: maxOrder } = await supabase
        .from('advertisements')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)
        .single();

    const newOrderIndex = (maxOrder?.order_index || 0) + 1;

    const { data: newAd, error } = await supabase
        .from('advertisements')
        .insert({ ...data, order_index: newOrderIndex })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return newAd;
}

export async function updateAdvertisement(id: string, data: Record<string, unknown>) {
    await ensureAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('advertisements')
        .update(data)
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function deleteAdvertisement(id: string) {
    await ensureAdmin();
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function reorderAdvertisements(items: { id: string; order_index: number }[]) {
    await ensureAdmin();
    const supabase = createAdminClient();

    const updates = items.map((item) =>
        supabase
            .from('advertisements')
            .update({ order_index: item.order_index })
            .eq('id', item.id)
    );

    const results = await Promise.all(updates);
    const failed = results.filter((r) => r.error);
    if (failed.length > 0) {
        throw new Error(`Falha ao reordenar ${failed.length} item(s)`);
    }

    return true;
}
