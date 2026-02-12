'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Save, Upload, Calendar, MapPin, Palette, MessageCircle, Crown, Image as ImageIcon } from 'lucide-react';
import { getSettings, saveSettings, uploadHeroImage } from '@/actions/admin-actions';
import toast from 'react-hot-toast';

interface Setting {
  key: string;
  value: string;
  label: string;
  type: 'text' | 'number' | 'date';
  placeholder?: string;
  colSpan?: number;
}

interface SettingsGroup {
  id: string;
  title: string;
  description?: string;
  icon: any;
  settings: Setting[];
}

const settingsGroups: SettingsGroup[] = [
  {
    id: 'event',
    title: 'Informações do Evento',
    description: 'Configure as datas principais do carnaval',
    icon: Calendar,
    settings: [
      { key: 'carnival_start_date', value: '', label: 'Data de Início', type: 'date' },
      { key: 'carnival_end_date', value: '', label: 'Data de Término', type: 'date' },
    ]
  },
  {
    id: 'location',
    title: 'Localização',
    description: 'Cidade e estado onde ocorre o evento',
    icon: MapPin,
    settings: [
      { key: 'city_name', value: '', label: 'Cidade', type: 'text', placeholder: 'Paracuru' },
      { key: 'state', value: '', label: 'Estado', type: 'text', placeholder: 'Ceará' },
    ]
  },
  {
    id: 'premium',
    title: 'Acesso Premium',
    description: 'Configurações de monetização e preços',
    icon: Crown,
    settings: [
      { key: 'premium_price', value: '', label: 'Preço Premium (R$)', type: 'number', placeholder: '1.99' },
      { key: 'premium_duration_days', value: '', label: 'Duração Premium (dias)', type: 'number', placeholder: '7' },
    ]
  },
  {
    id: 'appearance',
    title: 'Aparência',
    description: 'Personalização visual do app',
    icon: Palette,
    settings: [
      { key: 'hero_background_image', value: '', label: 'Imagem de Fundo da Hero - Home (URL)', type: 'text', placeholder: 'https://...', colSpan: 2 },
      { key: 'programacao_hero_image', value: '', label: 'Imagem de Fundo da Hero - Programação (URL)', type: 'text', placeholder: 'https://...', colSpan: 2 },
      // Future: Color scheme, Logo URL, etc.
    ]
  },

  {
    id: 'support',
    title: 'Suporte',
    description: 'Canais de atendimento ao usuário',
    icon: MessageCircle,
    settings: [
      { key: 'support_whatsapp', value: '', label: 'WhatsApp Suporte (com DDD)', type: 'text', placeholder: '85994293148', colSpan: 2 },
    ]
  }
];

export default function ConfiguracoesPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSettingKey, setSelectedSettingKey] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  async function handleImageUpload(key: string) {
    if (!selectedFile) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const url = await uploadHeroImage(formData, key);
      setValues({ ...values, [key]: url });
      toast.success('Imagem enviada com sucesso!');
      setSelectedFile(null);
      setSelectedSettingKey(null);
      setPreviewUrl(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar imagem');
    } finally {
      setUploadingImage(false);
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
      {/* Standard Header (matching other pages) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl text-surface-900">Configurações</h1>
          <p className="text-surface-500 text-sm mt-1">
            Gerencie os parâmetros globais do sistema
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto shadow-lg shadow-fire-500/20"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {settingsGroups.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.id}
              className={`admin-card h-full flex flex-col ${group.id === 'appearance' ? 'xl:col-span-2' : ''}`}
            >
              <div className="flex items-start gap-4 mb-6 border-b border-surface-100 pb-4 min-h-[120px]">
                <div className="p-3 rounded-xl bg-surface-50 text-surface-600 shrink-0">
                  <Icon size={24} />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="font-display text-lg text-surface-900 leading-tight">{group.title}</h2>
                  {group.description && (
                    <p className="text-sm text-surface-500 mt-1 line-clamp-2">{group.description}</p>
                  )}
                </div>
              </div>

              <div className={`grid grid-cols-1 ${group.settings.length > 1 ? 'md:grid-cols-2' : ''} gap-x-4 gap-y-6 flex-1 content-start`}>
                {group.settings.map((setting) => (
                  <div key={setting.key} className={setting.colSpan ? `col-span-${setting.colSpan}` : ''}>
                    {/* Label with forced min-height for alignment */}
                    <div className="min-h-[32px] mb-2 flex items-end">
                      <label className="block text-xs font-bold text-surface-500 uppercase tracking-wider">
                        {setting.label}
                      </label>
                    </div>

                    {setting.key.includes('hero_image') ? (
                      <div className="space-y-4 bg-surface-50 p-4 rounded-xl border border-surface-200">
                        {/* Preview Area */}
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-surface-200 shadow-inner group">
                          {((selectedSettingKey === setting.key && previewUrl) || values[setting.key]) ? (
                            <>
                              <Image
                                src={(selectedSettingKey === setting.key && previewUrl) ? previewUrl : values[setting.key]}
                                alt="Previsualização"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-surface-400 gap-2">
                              <ImageIcon size={32} />
                              <span className="text-sm">Sem imagem definida</span>
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={values[setting.key] || ''}
                              onChange={(e) =>
                                setValues({ ...values, [setting.key]: e.target.value })
                              }
                              placeholder={setting.placeholder}
                              className="input text-sm font-mono"
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="h-px bg-surface-200 flex-1" />
                            <span className="text-xs text-surface-400 font-medium">OU</span>
                            <div className="h-px bg-surface-200 flex-1" />
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                                  setSelectedFile(file);
                                  setSelectedSettingKey(setting.key);
                                  setPreviewUrl(URL.createObjectURL(file));
                                }
                              }}
                              className="hidden"
                              id={`upload-${setting.key}`}
                            />
                            <label
                              htmlFor={`upload-${setting.key}`}
                              className="flex-1 btn-secondary text-sm py-2 cursor-pointer text-center"
                            >
                              {selectedSettingKey === setting.key && selectedFile ? (
                                selectedFile.name.length > 25
                                  ? selectedFile.name.substring(0, 15) + '...' + selectedFile.name.substring(selectedFile.name.length - 7)
                                  : selectedFile.name
                              ) : 'Escolher Arquivo'}
                            </label>

                            {selectedSettingKey === setting.key && selectedFile && (
                              <button
                                onClick={() => handleImageUpload(setting.key)}
                                disabled={uploadingImage}
                                className="btn-primary py-2 px-4"
                              >
                                {uploadingImage ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={16} />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <input
                        type={setting.type}
                        value={values[setting.key] || ''}
                        onChange={(e) =>
                          setValues({ ...values, [setting.key]: e.target.value })
                        }
                        placeholder={setting.placeholder}
                        className="input"
                        step={setting.type === 'number' ? '0.01' : undefined}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
