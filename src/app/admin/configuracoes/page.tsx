'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { getSettings, saveSettings } from '@/actions/admin-actions';
import toast from 'react-hot-toast';

interface Setting {
  key: string;
  value: string;
  label: string;
  type: 'text' | 'number' | 'date';
}

const settings: Setting[] = [
  { key: 'carnival_name', value: '', label: 'Nome do Carnaval', type: 'text' },
  { key: 'carnival_start_date', value: '', label: 'Data de Início', type: 'date' },
  { key: 'carnival_end_date', value: '', label: 'Data de Término', type: 'date' },
  { key: 'city_name', value: '', label: 'Cidade', type: 'text' },
  { key: 'state', value: '', label: 'Estado', type: 'text' },
  { key: 'premium_price', value: '', label: 'Preço Premium (R$)', type: 'number' },
  { key: 'premium_duration_days', value: '', label: 'Duração Premium (dias)', type: 'number' },
  { key: 'hero_background_image', value: '', label: 'Imagem de Fundo (Hero URL)', type: 'text' },
  { key: 'about_text', value: '', label: 'Texto Sobre', type: 'text' },
];

// Force rebuild
export default function ConfiguracoesPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSettings();
      setValues(data);
    } catch (error) {
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);

    try {
      await saveSettings(values);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-surface-900">Configurações</h1>
          <p className="text-surface-500 text-sm mt-1">
            Configure os parâmetros do aplicativo
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Salvar
        </button>
      </div>

      <div className="p-6">
        <div className="admin-card max-w-3xl">
          <div className="space-y-6">
            {settings.map((setting) => (
              <div key={setting.key}>
                <label className="block text-sm font-semibold text-surface-700 mb-2">
                  {setting.label}
                </label>
                {setting.type === 'text' && setting.key === 'about_text' ? (
                  <textarea
                    value={values[setting.key] || ''}
                    onChange={(e) =>
                      setValues({ ...values, [setting.key]: e.target.value })
                    }
                    className="textarea"
                    rows={4}
                  />
                ) : (
                  <input
                    type={setting.type}
                    value={values[setting.key] || ''}
                    onChange={(e) =>
                      setValues({ ...values, [setting.key]: e.target.value })
                    }
                    className="input"
                    step={setting.type === 'number' ? '0.01' : undefined}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
