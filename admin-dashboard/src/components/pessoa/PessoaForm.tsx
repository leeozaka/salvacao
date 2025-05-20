import React, { useState, useEffect, useCallback } from 'react';
import { CreatePessoaDTO, UpdatePessoaDTO } from '@/dto/PessoaDTO';
import { TipoDocumento, TipoUsuario } from '@/types/enums';
import { Pessoa } from '@/types/entities';

interface PessoaFormProps {
  pessoa?: Pessoa | null; // Pessoa data for editing, null for creating
  onSubmit: (data: CreatePessoaDTO | UpdatePessoaDTO) => Promise<void>;
  onCancel: () => void;
  isEditMode: boolean;
  title: string;
}

const PessoaForm: React.FC<PessoaFormProps> = ({ 
  pessoa,
  onSubmit,
  onCancel,
  isEditMode,
  title 
}) => {
  const [formData, setFormData] = useState<CreatePessoaDTO | UpdatePessoaDTO>(() => {
    if (isEditMode && pessoa) {
      return {
        nome: pessoa.nome || '',
        email: pessoa.email || '',
        documentoIdentidade: pessoa.documentoIdentidade || '',
        tipoDocumento: pessoa.tipoDocumento || undefined,
        telefone: pessoa.telefone || '',
        endereco: pessoa.endereco || '',
        tipoUsuario: pessoa.usuario?.tipoUsuario || TipoUsuario.USER, 
        isActive: pessoa.isActive !== undefined ? pessoa.isActive : true,
        usuarioIsActive: pessoa.usuario?.isActive !== undefined ? pessoa.usuario.isActive : true,
        // Senha is not pre-filled for editing for security
      };
    } else {
      return {
        nome: '',
        email: '',
        documentoIdentidade: '',
        tipoDocumento: TipoDocumento.CPF,
        telefone: '',
        endereco: '',
        tipoUsuario: TipoUsuario.USER,
        senha: '',
      };
    }
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Reset form when pessoa changes or edit mode changes
  useEffect(() => {
    if (isEditMode && pessoa) {
      setFormData({
        nome: pessoa.nome || '',
        email: pessoa.email || '',
        documentoIdentidade: pessoa.documentoIdentidade || '',
        tipoDocumento: pessoa.tipoDocumento || undefined,
        telefone: pessoa.telefone || '',
        endereco: pessoa.endereco || '',
        tipoUsuario: pessoa.usuario?.tipoUsuario || TipoUsuario.USER,
        isActive: pessoa.isActive !== undefined ? pessoa.isActive : true,
        usuarioIsActive: pessoa.usuario?.isActive !== undefined ? pessoa.usuario.isActive : true,
        // senha is not pre-filled
      });
    } else if (!isEditMode) {
        setFormData({
            nome: '',
            email: '',
            documentoIdentidade: '',
            tipoDocumento: TipoDocumento.CPF,
            telefone: '',
            endereco: '',
            tipoUsuario: TipoUsuario.USER,
            senha: '',
          });
    }
  }, [pessoa, isEditMode]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | boolean | undefined | number = value;
    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    }
    if (name === 'tipoDocumento' || name === 'tipoUsuario') {
        processedValue = value as TipoDocumento | TipoUsuario;
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.nome || !formData.email) {
      setError('Nome e Email são obrigatórios.');
      return false;
    }
    if (!isEditMode && !(formData as CreatePessoaDTO).senha) {
      setError('Senha é obrigatória para novos usuários.');
      return false;
    }
    return true;
  }, [formData, isEditMode]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setLoading(false);
    }
  }, [formData, onSubmit, validateForm]);

  // Memoized values for rendering optimization
  const tipoDocumentoOptions = Object.values(TipoDocumento);
  const tipoUsuarioOptions = Object.values(TipoUsuario);

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white rounded-lg shadow-xl md:p-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">{title}</h2>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300" role="alert">
          <i className="bi bi-exclamation-triangle-fill mr-2"></i> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="nome" className="block mb-1 text-sm font-medium text-gray-600">Nome Completo *</label>
          <input 
            type="text" 
            name="nome" 
            id="nome" 
            value={formData.nome}
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required 
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-600">Email *</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            value={formData.email}
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="documentoIdentidade" className="block mb-1 text-sm font-medium text-gray-600">Documento de Identidade</label>
          <input 
            type="text" 
            name="documentoIdentidade" 
            id="documentoIdentidade" 
            value={formData.documentoIdentidade || ''}
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="tipoDocumento" className="block mb-1 text-sm font-medium text-gray-600">Tipo de Documento</label>
          <select 
            name="tipoDocumento" 
            id="tipoDocumento" 
            value={formData.tipoDocumento || ''}
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            {tipoDocumentoOptions.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="telefone" className="block mb-1 text-sm font-medium text-gray-600">Telefone</label>
        <input 
          type="text" 
          name="telefone" 
          id="telefone" 
          value={formData.telefone || ''}
          onChange={handleChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="endereco" className="block mb-1 text-sm font-medium text-gray-600">Endereço</label>
        <textarea 
          name="endereco" 
          id="endereco" 
          value={formData.endereco || ''}
          onChange={handleChange} 
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="tipoUsuario" className="block mb-1 text-sm font-medium text-gray-600">Tipo de Usuário *</label>
          <select 
            name="tipoUsuario" 
            id="tipoUsuario" 
            value={formData.tipoUsuario}
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            required
          >
            {tipoUsuarioOptions.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="senha" className="block mb-1 text-sm font-medium text-gray-600">
            {isEditMode ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha *'}
          </label>
          <input 
            type="password" 
            name="senha" 
            id="senha" 
            value={(formData as CreatePessoaDTO).senha || ''} // Only show for CreateDTO or if explicitly set for UpdateDTO
            onChange={handleChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            autoComplete={isEditMode ? "new-password" : "current-password"}
          />
        </div>
      </div>

      {isEditMode && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4 border-t">
            <div className="flex items-center">
                <input 
                    id="isActive" 
                    name="isActive" 
                    type="checkbox" 
                    checked={(formData as UpdatePessoaDTO).isActive || false}
                    onChange={handleChange} 
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Pessoa Ativa</label>
            </div>
            <div className="flex items-center">
                <input 
                    id="usuarioIsActive" 
                    name="usuarioIsActive" 
                    type="checkbox" 
                    checked={(formData as UpdatePessoaDTO).usuarioIsActive || false}
                    onChange={handleChange} 
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                />
                <label htmlFor="usuarioIsActive" className="text-sm font-medium text-gray-700">Usuário Ativo</label>
            </div>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-6 border-t mt-6">
        <button 
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:text-sm disabled:opacity-50"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3 sm:mb-0 sm:text-sm disabled:opacity-50"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {isEditMode ? 'Salvar Alterações' : 'Cadastrar Pessoa'}
        </button>
      </div>
    </form>
  );
};

export default React.memo(PessoaForm); 