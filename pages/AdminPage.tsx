
import React, { useState, useEffect } from 'react';
import { authService, fileToBase64 } from '../auth/auth.service';
import { UserRole } from '../types/user';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';

export const AdminPage: React.FC = () => {
  const { user: currentUserData } = useAuth();
  const { t } = useLanguage();
  
  // --- Estados de Dados ---
  const [users, setUsers] = useState<any[]>([]); // Lista completa
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // Lista filtrada pela busca
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // --- Estados do Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null); // Se null, é modo Criação
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.USER as string
  });
  
  // --- Estados de Upload e UI ---
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Carrega usuários ao montar o componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Filtra a lista sempre que o termo de busca ou a lista original mudam
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(lowerTerm) || 
        user.email.toLowerCase().includes(lowerTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  /**
   * Busca todos os usuários do serviço.
   */
  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await authService.getAllUsers();
      // Adiciona um status fictício para visualização
      const usersWithStatus = allUsers.map(u => ({
        ...u,
        status: u.status || 'Ativo'
      }));
      setUsers(usersWithStatus);
      setFilteredUsers(usersWithStatus);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre o modal.
   * Se 'user' for passado, popula o formulário (Edição).
   * Se não, limpa o formulário (Criação).
   */
  const handleOpenModal = (user?: any) => {
    setModalError(null);
    setAvatarFile(undefined);
    
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role
      });
      setAvatarPreview(user.avatar);
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: UserRole.USER
      });
      setAvatarPreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setAvatarFile(undefined);
    setAvatarPreview(null);
  };

  // Preview da imagem selecionada antes do upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Salva (Cria ou Edita) o usuário.
   * Lida com conversão de imagem para Base64.
   */
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setIsSaving(true);

    try {
      // Lógica de Avatar: Mantém o antigo, usa o novo ou deixa vazio
      let avatarBase64 = editingUser?.avatar;
      
      if (!editingUser && !avatarPreview) {
        avatarBase64 = undefined;
      }

      if (avatarFile) {
        avatarBase64 = await fileToBase64(avatarFile);
      }

      if (editingUser) {
        // Modo Edição
        await authService.updateUser(editingUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role as UserRole,
          avatar: avatarBase64
        });
      } else {
        // Modo Criação
        await authService.createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role as UserRole,
          avatar: avatarBase64
        });
      }
      await loadUsers(); // Recarrega lista
      handleCloseModal();
    } catch (err: any) {
      const errorMsg = t(err.message);
      setModalError(errorMsg === err.message ? t('errors.genericSave') : errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Exclui usuário com confirmação.
   * Possui 'Optimistic Update' (atualiza UI antes do backend confirmar) para sensação de rapidez,
   * mas reverte em caso de erro.
   */
  const handleDelete = async (id: string, name: string) => {
    if (id === currentUserData?.id) {
      alert(t('errors.selfDelete'));
      return;
    }

    if (window.confirm(`${t('errors.deleteConfirm')} ${name}?`)) {
      try {
        await authService.deleteUser(id);
        // Atualização Otimista
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (error) {
        alert(t('errors.genericSave'));
        loadUsers(); // Reverte carregando do servidor
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('admin.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400">{t('admin.subtitle')}</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-bold text-sm"
        >
          {t('admin.addUser')}
        </button>
      </header>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center transition-colors duration-200">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-700 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder={t('admin.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ml-4 text-sm text-slate-500 dark:text-slate-400">
          {filteredUsers.length} {t('admin.usersFound')}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">{t('common.loading')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('common.user')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('common.role')}</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('common.status')}</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-600" src={user.avatar} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${
                        user.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' : 
                        user.role === 'USER' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 
                        'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${
                        user.status === 'Ativo' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                      }`}>
                        {t('common.active')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 font-bold"
                      >
                        {t('common.edit')}
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-bold"
                        disabled={user.id === currentUserData?.id}
                      >
                        {t('common.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                      {t('admin.noUsers')} "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background backdrop */}
            <div 
              className="fixed inset-0 bg-slate-500 bg-opacity-75 dark:bg-slate-900 dark:bg-opacity-80 transition-opacity" 
              aria-hidden="true"
              onClick={handleCloseModal}
            ></div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-bold text-slate-900 dark:text-white" id="modal-title">
                        {editingUser ? t('admin.editUser') : t('admin.newUser')}
                      </h3>
                      <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2">
                      {modalError && (
                        <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm rounded border border-red-200 dark:border-red-800">
                          {modalError}
                        </div>
                      )}
                      
                      <form id="userForm" onSubmit={handleSave} className="space-y-5">
                        {/* Avatar Upload */}
                        <div className="flex justify-center mb-6">
                          <div className="relative group">
                            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 shadow-md bg-slate-100 dark:bg-slate-800">
                              {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-300 font-bold text-2xl">
                                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                                </div>
                              )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-transform hover:scale-110">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleAvatarChange} 
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{t('common.name')}</label>
                          <input 
                            type="text" 
                            required
                            className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{t('common.email')}</label>
                          <input 
                            type="email" 
                            required
                            className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors disabled:opacity-50"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            disabled={!!editingUser} 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{t('common.role')}</label>
                          <select 
                            className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                          >
                            <option value={UserRole.USER}>{t('common.user')}</option>
                            <option value={UserRole.ADMIN}>{t('common.admin')}</option>
                            <option value={UserRole.VIEWER}>{t('common.viewer')}</option>
                          </select>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100 dark:border-slate-700">
                <button 
                  type="submit" 
                  form="userForm"
                  disabled={isSaving}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 sm:ml-3 sm:w-auto sm:text-sm ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? t('admin.saving') : t('common.save')}
                </button>
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
