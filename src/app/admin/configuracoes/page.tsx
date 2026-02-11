'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Save, Upload } from 'lucide-react';
import { getSettings, saveSettings, uploadHeroImage } from '@/actions/admin-actions';
import toast from 'react-hot-toast';

interface Setting {
  key: string;
  value: string;
  label: string;
  type: 'text' | 'number' | 'date';
  placeholder?: string;
}

interface SettingsGroup {
  title: string;
  description?: string;
  settings: Setting[];
}

const settingsGroups: SettingsGroup[] = [
  {
    title: 'Informações do Evento',
    description: 'Configure as datas do carnaval',
    settings: [
      { key: 'carnival_start_date', value: '', label: 'Data de Início', type: 'date' },
      { key: 'carnival_end_date', value: '', label: 'Data de Término', type: 'date' },
    ]
  },
  {
    title: 'Localização',
    description: 'Cidade e estado do evento',
    settings: [
      { key: 'city_name', value: '', label: 'Cidade', type: 'text', placeholder: 'Paracuru' },
      { key: 'state', value: '', label: 'Estado', type: 'text', placeholder: 'Ceará' },
    ]
  },
  {
    title: 'Acesso Premium',
    description: 'Configurações de monetização',
    settings: [
      { key: 'premium_price', value: '', label: 'Preço Premium (R$)', type: 'number', placeholder: '1.99' },
      { key: 'premium_duration_days', value: '', label: 'Duração Premium (dias)', type: 'number', placeholder: '7' },
    ]
  },
  {
    title: 'Aparência',
    description: 'Personalização visual do app',
    settings: [
      { key: 'hero_background_image', value: '', label: 'Imagem de Fundo da Hero (URL)', type: 'text', placeholder: 'https://...' },
    ]
  },
  {
    title: 'Suporte',
    description: 'Contato para suporte',
    settings: [
      { key: 'support_whatsapp', value: '', label: 'WhatsApp Suporte (com DDD)', type: 'text', placeholder: '85994293148' },
    ]
  }
];

// Force rebuild
export default function ConfiguracoesPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  async function handleImageUpload() {
    if (!selectedFile) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const url = await uploadHeroImage(formData);
      setValues({ ...values, hero_background_image: url });
      toast.success('Imagem enviada com sucesso!');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar imagem');
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
          <div className="space-y-8">
            {settingsGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div className="mb-4">
                  <h2 className="font-display text-lg text-surface-900">{group.title}</h2>
                  {group.description && (
                    <p className="text-sm text-surface-500 mt-1">{group.description}</p>
                  )}
                </div>
                <div className="space-y-4 pl-4 border-l-2 border-surface-200">
                  {group.settings.map((setting) => (
                    <div key={setting.key}>
                      <label className="block text-sm font-semibold text-surface-700 mb-2">
                        {setting.label}
                      </label>

                      {setting.key === 'hero_background_image' ? (
                        <div className="space-y-3">
                          {/* Preview da imagem atual */}
                          {values[setting.key] && (
                            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-surface-200">
                              <Image
                                src={values[setting.key]}
                                alt="Hero preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                          {/* Input de URL */}
                          <input
                            type="text"
                            value={values[setting.key] || ''}
                            onChange={(e) =>
                              setValues({ ...values, [setting.key]: e.target.value })
                            }
                            placeholder={setting.placeholder}
                            className="input"
                          />

                          <div className="text-center text-sm text-surface-500 font-medium">OU</div>

                          {/* Upload de arquivo */}
                          <div className="space-y-2">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSelectedFile(file);
                                  setPreviewUrl(URL.createObjectURL(file));
                                }
                              }}
                              className="hidden"
                              id="hero-image-upload"
                            />

                            {previewUrl && (
                              <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-carnival-500">
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                              </div>
                            )}

                            <div className="flex gap-2">
                              <label
                                htmlFor="hero-image-upload"
                                className="flex-1 py-2 px-4 rounded-lg bg-surface-100 text-surface-700 font-semibold text-sm hover:bg-surface-200 transition-colors cursor-pointer text-center border border-surface-200"
                              >
                                📁 Escolher Arquivo
                              </label>

                              {selectedFile && (
                                <button
                                  onClick={handleImageUpload}
                                  disabled={uploadingImage}
                                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                                >
                                  {uploadingImage ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      Enviando...
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={16} />
                                      Upload
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <p className="text-xs text-surface-500">
                              Formatos: JPG, PNG, WebP (máx 5MB)
                            </p>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
