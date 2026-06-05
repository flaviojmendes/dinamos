import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { trackProfileUpdate } from '../utils/analytics';
import { Panel, TacticalButton } from '../components/tactical';

const inputClass =
  'shadow-sm block w-full sm:text-sm border border-slate-300 dark:border-tactical-border rounded-md dark:rounded-none bg-white dark:bg-tactical-surface text-slate-900 dark:text-tactical-text focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-signal-green focus:border-transparent';

const labelClass =
  'block text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-tactical-label';

const Profile = () => {
  const { appUser, refreshUserProfile } = useAuth();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [avatarImage, setAvatarImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (appUser) {
      setNickname(appUser.nickname || '');
      setEmail(appUser.email || '');
      setGithubUsername(appUser.github_username || '');
      setAvatarImage(appUser.avatar_image || '');
    }
  }, [appUser]);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          const maxWidth = 500;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          const resizedImage = canvas.toDataURL(file.type);
          resolve(resizedImage);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        setAvatarImage(resizedImage);
      } catch (error) {
        console.error('Error resizing image:', error);
        setMessage({ type: 'error', text: 'Failed to process image.' });
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload: any = {
        nickname,
        avatar_image: avatarImage
      };
      
      if (!appUser?.email && email) {
        payload.email = email;
      }

      await apiClient.put('/api/users/me', payload);
      await refreshUserProfile();
      trackProfileUpdate('profile');
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'border border-signal-cyan/40 text-signal-cyan bg-signal-cyan/10';
      case 'Tutor':
        return 'border border-brand-500/40 text-brand-600 dark:text-signal-cyan bg-brand-500/10 dark:bg-signal-cyan/10';
      default:
        return 'border border-slate-300 dark:border-tactical-line text-slate-600 dark:text-tactical-dim bg-slate-100 dark:bg-tactical-raised';
    }
  };

  if (!appUser) {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono uppercase tracking-wider text-sm text-slate-500 dark:text-tactical-dim">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="flex items-center gap-2 before:content-[''] before:h-6 before:w-1 before:bg-signal-amber before:shrink-0 font-mono uppercase tracking-wider text-2xl font-bold text-slate-900 dark:text-tactical-text mb-8 pl-2">
            Perfil de Usuário
          </h1>
          
          <Panel className="dark:rounded-none overflow-hidden" padded={false} bodyClassName="p-6 sm:p-8">
              {message.text && (
                <div className={`mb-6 p-4 border dark:rounded-none ${message.type === 'success' ? 'border-signal-green/40 bg-signal-green/10 text-signal-green' : 'border-signal-red/40 bg-signal-red/10 text-signal-red'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                
                <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-8">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full overflow-hidden bg-slate-200 dark:bg-tactical-raised border-4 border-white dark:border-tactical-border">
                      {avatarImage ? (
                        <img src={avatarImage} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400 dark:text-tactical-label">
                          <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-slate-900 dark:bg-white text-white dark:text-black p-2 rounded-full dark:rounded-none shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:focus-visible:ring-signal-green"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                    />
                  </div>
                  
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start space-x-4 mb-2">
                      <h3 className="font-mono uppercase tracking-wider text-sm font-semibold text-slate-900 dark:text-tactical-text">Foto de Perfil</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 dark:rounded-none text-[10px] font-mono uppercase tracking-wider font-medium ${getRoleBadgeColor(appUser.role)}`}>
                        {appUser.role}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-tactical-dim mt-1">
                      Clique no ícone da câmera para fazer o upload de uma foto de perfil personalizada.
                    </p>
                  </div>
                </div>

                <hr className="border-slate-200 dark:border-tactical-border" />

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {githubUsername ? (
                    <div className="sm:col-span-4">
                      <label htmlFor="github" className={labelClass}>
                        Usuário do GitHub
                      </label>
                      <div className="mt-1 flex rounded-md dark:rounded-none">
                        <span className="inline-flex items-center px-3 rounded-l-md dark:rounded-none border border-r-0 border-slate-300 dark:border-tactical-border bg-slate-50 dark:bg-tactical-raised text-slate-500 dark:text-tactical-dim sm:text-sm font-mono text-xs uppercase tracking-wider">
                          github.com/
                        </span>
                        <input
                          type="text"
                          name="github"
                          id="github"
                          value={githubUsername}
                          disabled
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md dark:rounded-none border border-slate-300 dark:border-tactical-border bg-slate-100 dark:bg-tactical-surface text-slate-500 dark:text-tactical-dim cursor-not-allowed sm:text-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-tactical-label">
                        Vinculado à sua conta do GitHub.
                      </p>
                    </div>
                  ) : (
                    <div className="sm:col-span-4">
                      <label htmlFor="email" className={labelClass}>
                        Endereço de Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={!!appUser.email}
                          className={`${inputClass} ${!!appUser.email ? 'bg-slate-100 dark:bg-tactical-raised text-slate-500 dark:text-tactical-dim cursor-not-allowed' : ''}`}
                          placeholder={!appUser.email ? "Adicione seu email" : ""}
                          required={!appUser.email}
                        />
                        {!!appUser.email ? (
                          <p className="mt-1 text-xs text-slate-500 dark:text-tactical-label">O email não pode ser alterado.</p>
                        ) : (
                          <p className="mt-1 text-xs text-signal-amber">Por favor, adicione um email para completar seu cadastro.</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="sm:col-span-4">
                    <label htmlFor="nickname" className={labelClass}>
                      Apelido
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className={inputClass}
                        placeholder="Como devemos te chamar?"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-200 dark:border-tactical-border">
                  <div className="flex justify-end">
                    <TacticalButton
                      type="submit"
                      variant="primary"
                      disabled={saving}
                      className={`dark:rounded-none ${saving ? 'opacity-75 cursor-wait' : ''}`}
                    >
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </TacticalButton>
                  </div>
                </div>
              </form>
          </Panel>
        </div>
      </main>
    </div>
  );
};

export default Profile;
