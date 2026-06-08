import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/api';
import Navbar from '../components/Navbar';
import { TacticalButton } from '../components/tactical';
import { Role, Permission } from '../types';

const inputClass =
  'mt-1 block w-full rounded-md bg-white dark:bg-tactical-surface border border-slate-300 dark:border-tactical-border text-slate-900 dark:text-tactical-text placeholder:text-slate-400 dark:placeholder:text-tactical-label focus:ring-brand-500 dark:focus:ring-signal-green sm:text-sm px-3 py-2';
const labelClass = 'block text-sm font-medium text-slate-600 dark:text-tactical-dim';

interface RoleFormData {
  name: string;
  color: string;
  description: string;
  permissions: string[];
}

const AdminRoles = () => {
  const { appUser } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const initialFormData: RoleFormData = {
    name: '',
    color: '#3B82F6',
    description: '',
    permissions: []
  };
  
  const [formData, setFormData] = useState<RoleFormData>(initialFormData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        apiClient.get('/api/admin/roles'),
        apiClient.get('/api/admin/permissions')
      ]);
      setRoles(rolesRes.data.roles);
      setPermissions(permsRes.data.permissions);
      setError('');
    } catch (err) {
      console.error('Error fetching roles/permissions:', err);
      setError('Failed to load roles. You might not have permission.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      color: role.color,
      description: role.description || '',
      permissions: role.permissions || []
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingRole(null);
    setFormData(initialFormData);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingRole(null);
    setIsCreating(false);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isCreating) {
        const response = await apiClient.post('/api/admin/roles', formData);
        setRoles([...roles, response.data]);
      } else if (editingRole) {
        const response = await apiClient.put(`/api/admin/roles/${editingRole.id}`, formData);
        setRoles(roles.map(r => r.id === editingRole.id ? response.data : r));
      }
      handleCancel();
    } catch (err: any) {
      console.error('Error saving role:', err);
      alert(err.response?.data?.detail || 'Failed to save role');
    }
  };

  const handleDelete = async (roleId: number) => {
    if (!window.confirm('Are you sure? Users with this role may lose access.')) return;
    
    try {
      await apiClient.delete(`/api/admin/roles/${roleId}`);
      setRoles(roles.filter(r => r.id !== roleId));
    } catch (err) {
      console.error('Error deleting role:', err);
      alert('Failed to delete role');
    }
  };

  const togglePermission = (code: string) => {
    setFormData(prev => {
      const perms = prev.permissions.includes(code)
        ? prev.permissions.filter(p => p !== code)
        : [...prev.permissions, code];
      return { ...prev, permissions: perms };
    });
  };

  if (!appUser || appUser.role !== 'Admin') {
    return (
      <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-600 dark:text-tactical-dim">Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-paper dark:bg-canvas-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-900 dark:text-tactical-text">
              Gerenciamento de papéis
            </h1>
            <TacticalButton variant="primary" onClick={handleCreate}>
              Create New Role
            </TacticalButton>
          </div>

          {error && (
            <div className="border border-signal-red/40 bg-signal-red/10 p-4 mb-8">
              <p className="text-sm text-signal-red">{error}</p>
            </div>
          )}

          {/* Role List */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {roles.map(role => (
              <div key={role.id} className="tactical-panel p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-sans text-lg font-semibold text-slate-900 dark:text-tactical-text">{role.name}</h3>
                      <span 
                        className="w-6 h-6 border border-slate-200 dark:border-tactical-border"
                        style={{ backgroundColor: role.color }}
                      ></span>
                    </div>
                    <p className="text-slate-600 dark:text-tactical-dim mt-1">{role.description}</p>
                    
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-slate-500 dark:text-tactical-label mb-2">Permissões</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map(permCode => (
                          <span key={permCode} className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-tactical-line text-xs font-medium text-slate-700 dark:text-tactical-dim bg-slate-50 dark:bg-tactical-raised">
                            {permissions.find(p => p.code === permCode)?.description || permCode}
                          </span>
                        ))}
                        {role.permissions.length === 0 && (
                          <span className="text-sm text-slate-500 dark:text-tactical-label italic">No permissions assigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <TacticalButton variant="secondary" size="sm" type="button" onClick={() => handleEdit(role)}>
                      Edit
                    </TacticalButton>
                    {role.name !== 'Admin' && (
                      <TacticalButton variant="danger" size="sm" type="button" onClick={() => handleDelete(role.id)}>
                        Delete
                      </TacticalButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit/Create Modal */}
          {(editingRole || isCreating) && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="tactical-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                  <h2 className="font-sans text-xl font-bold text-slate-900 dark:text-tactical-text mb-6">
                    {isCreating ? 'Criar novo papel' : 'Editar papel'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Role Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    
                    <div>
                      <label className={labelClass}>Color</label>
                      <div className="flex items-center mt-1">
                        <input
                          type="color"
                          value={formData.color}
                          onChange={e => setFormData({ ...formData, color: e.target.value })}
                          className="h-8 w-16 border-0 p-0 cursor-pointer"
                        />
                        <span className="ml-2 font-mono text-sm text-slate-500 dark:text-tactical-label">{formData.color}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    
                    <div>
                      <label className={`${labelClass} mb-2`}>Permissions</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 dark:bg-tactical-raised p-4 border border-slate-200 dark:border-tactical-border">
                        {permissions.map(perm => (
                          <label key={perm.code} className="flex items-start space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-tactical-surface cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.code)}
                              onChange={() => togglePermission(perm.code)}
                              className="h-4 w-4 accent-signal-green border-slate-300 dark:border-tactical-border"
                            />
                            <span className="text-sm text-slate-700 dark:text-tactical-text">
                              <span className="font-mono text-xs block">{perm.code}</span>
                              <span className="text-xs text-slate-500 dark:text-tactical-dim">{perm.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end gap-3">
                    <TacticalButton type="button" variant="secondary" onClick={handleCancel}>
                      Cancel
                    </TacticalButton>
                    <TacticalButton type="submit" variant="primary">
                      Save Role
                    </TacticalButton>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminRoles;

