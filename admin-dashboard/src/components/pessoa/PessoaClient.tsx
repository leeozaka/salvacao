"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  buscarPessoas,
  cadastrarPessoa,
  atualizarPessoa,
  excluirPessoa,
} from '@/services/pessoaService';
import { Pessoa } from '@/types/entities';
import { CreatePessoaDTO, UpdatePessoaDTO } from '@/dto/PessoaDTO';
import { TipoUsuario } from '@/types/enums';
import PessoaForm from './PessoaForm';

const PessoasClient: React.FC = () => {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalEditOpen, setModalEditOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  const [pessoaEmEdicao, setPessoaEmEdicao] = useState<Pessoa | null>(null);

  const [pesquisaPessoa, setPesquisaPessoa] = useState<string>('');
  const [filtroTipoUsuario, setFiltroTipoUsuario] = useState<string>('todos');
  const [debouncedPesquisa, setDebouncedPesquisa] = useState<string>('');

  const filtrosAtivos = useMemo(() => {
    const filtros: { termo?: string, tipoUsuario?: string } = {};
    if (debouncedPesquisa) {
      filtros.termo = debouncedPesquisa;
    }
    if (filtroTipoUsuario && filtroTipoUsuario !== 'todos') {
      filtros.tipoUsuario = filtroTipoUsuario as TipoUsuario;
    }
    return filtros;
  }, [debouncedPesquisa, filtroTipoUsuario]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPesquisa(pesquisaPessoa);
    }, 500);
    return () => clearTimeout(timer);
  }, [pesquisaPessoa]);

  const carregarPessoas = useCallback(async (filtrosToApply?: { termo?: string, tipoUsuario?: string }) => {
    try {
      setLoading(true);
      const response = await buscarPessoas(filtrosToApply);
      setPessoas(response);
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar pessoas.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPessoas(filtrosAtivos);
  }, [filtrosAtivos, carregarPessoas]);

  const limparFiltros = useCallback(() => {
    setPesquisaPessoa('');
    setFiltroTipoUsuario('todos');
  }, []);

  const handleNovaPessoa = useCallback(() => {
    setPessoaEmEdicao(null);
    setModalOpen(true);
  }, []);

  const handleSalvarPessoa = useCallback(async (data: CreatePessoaDTO | UpdatePessoaDTO) => {
    try {
      await cadastrarPessoa(data as CreatePessoaDTO);
      setModalOpen(false);
      setSuccess('Pessoa cadastrada com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
      carregarPessoas(filtrosAtivos);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erro ao salvar pessoa'
      );
      setTimeout(() => setError(''), 5000);
      throw err;
    }
  }, [carregarPessoas, filtrosAtivos]);

  const handleEditarPessoa = useCallback((pessoa: Pessoa) => {
    setPessoaEmEdicao(pessoa);
    setModalEditOpen(true);
  }, []);

  const handleSalvarEdicao = useCallback(async (data: UpdatePessoaDTO) => {
    if (!pessoaEmEdicao) return;
    try {
      await atualizarPessoa(pessoaEmEdicao.id, data);
      setModalEditOpen(false);
      setSuccess('Pessoa atualizada com sucesso!');
      setPessoaEmEdicao(null);
      setTimeout(() => setSuccess(''), 3000);
      carregarPessoas(filtrosAtivos);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Erro ao atualizar pessoa'
      );
      setTimeout(() => setError(''), 5000);
      throw err;
    }
  }, [pessoaEmEdicao, carregarPessoas, filtrosAtivos]);

  const handleExcluirPessoa = useCallback(async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta pessoa? Esta ação não pode ser desfeita.')) {
      try {
        await excluirPessoa(id);
        setSuccess('Pessoa excluída com sucesso!');
        setTimeout(() => setSuccess(''), 3000);
        carregarPessoas(filtrosAtivos);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Erro ao excluir pessoa'
        );
        setTimeout(() => setError(''), 5000);
      }
    }
  }, [carregarPessoas, filtrosAtivos]);
  
  const getTipoUsuarioNome = useCallback((tipo?: TipoUsuario) => {
    if (!tipo) return 'Não especificado';
    return tipo.toString();
  }, []);

  return (
    <div className="bg-[var(--color-bg-color)] min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[var(--color-primary-color)] mb-2">
              Gerenciamento de Pessoas e Usuários
            </h1>
            <p className="text-[var(--color-text-color)]">
              Cadastre, visualize, edite e gerencie pessoas e seus perfis de usuário.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md animate-fadeIn">
              <div className="flex items-center">
                <i className="bi bi-exclamation-circle text-xl mr-3"></i>
                <p>{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-md animate-fadeIn">
              <div className="flex items-center">
                <i className="bi bi-check-circle text-xl mr-3"></i>
                <p>{success}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:max-w-lg">
              <input
                type="text"
                placeholder="Buscar por nome, email, documento..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)] focus:border-[var(--color-primary-color)] transition-colors"
                value={pesquisaPessoa}
                onChange={(e) => setPesquisaPessoa(e.target.value)}
              />
              <i className="bi bi-search absolute left-3 top-3.5 text-[var(--color-placeholder-color)]"></i>
            </div>
            <button
              className="w-full md:w-auto bg-[var(--color-primary-color)] hover:bg-[var(--color-secondary-color)] text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
              onClick={handleNovaPessoa}
            >
              <i className="bi bi-plus-lg mr-2"></i>
              Nova Pessoa
            </button>
          </div>

          <div className="bg-[var(--color-menu-bg)] p-5 rounded-xl mb-6 border border-[var(--color-primary-color)]/20 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-secondary-color)] mb-4">
              Filtros Avançados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[var(--color-text-color)] text-sm font-medium mb-2">
                  Filtrar por Tipo de Usuário:
                </label>
                <select
                  className="w-full px-3 py-2 border border-[var(--color-primary-color)]/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-color)] focus:border-[var(--color-primary-color)] transition-colors bg-white text-[var(--color-text-color)]"
                  value={filtroTipoUsuario}
                  onChange={(e) => setFiltroTipoUsuario(e.target.value)}
                >
                  <option value="todos">Todos os Tipos</option>
                  {Object.values(TipoUsuario).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {getTipoUsuarioNome(tipo)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end md:col-span-1">
                <button
                  className="w-full px-4 py-2 bg-gray-100 text-[var(--color-text-color)] rounded-lg hover:bg-[var(--color-menu-hover)] transition-colors flex items-center justify-center font-medium shadow-sm"
                  onClick={limparFiltros}
                >
                  <i className="bi bi-x-circle mr-2"></i>
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-[var(--color-primary-color)] mb-4"></div>
              <p className="text-[var(--color-text-color)] text-lg">
                Carregando pessoas...
              </p>
            </div>
          ) : pessoas.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[var(--color-menu-bg)]">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider">Documento</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider">Telefone</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider">Tipo Usuário</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-[var(--color-secondary-color)] uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pessoas.map((pessoa) => (
                      <tr key={pessoa.id} className="group transition-colors hover:bg-[var(--color-menu-bg)]/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[var(--color-text-color)]">{pessoa.nome}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[var(--color-text-color)]">{pessoa.email || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[var(--color-text-color)]">
                            {pessoa.documentoIdentidade ? `${pessoa.tipoDocumento || ''}: ${pessoa.documentoIdentidade}` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[var(--color-text-color)]">{pessoa.telefone || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pessoa.usuario?.tipoUsuario === TipoUsuario.ADMIN ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                            {getTipoUsuarioNome(pessoa.usuario?.tipoUsuario)}
                          </span>
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pessoa.isActive && pessoa.usuario?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {pessoa.isActive && pessoa.usuario?.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditarPessoa(pessoa)}
                              className="p-2 text-[var(--color-primary-color)] hover:text-[var(--color-secondary-color)] hover:bg-[var(--color-menu-hover)] rounded-full transition-colors opacity-80 group-hover:opacity-100"
                              title="Editar Pessoa"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              onClick={() => handleExcluirPessoa(pessoa.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors opacity-80 group-hover:opacity-100"
                              title="Excluir Pessoa"
                            >
                              <i className="bi bi-trash3"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                    <i className="bi bi-people text-3xl"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Nenhuma pessoa encontrada
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Não foram encontradas pessoas com os filtros selecionados ou nenhuma pessoa foi cadastrada ainda.
                </p>
                <button
                    className="px-6 py-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg font-medium transition-colors shadow-sm"
                    onClick={handleNovaPessoa}
                >
                    <i className="bi bi-plus-circle mr-2"></i>
                    Adicionar Pessoa
                </button>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="group flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              <i className="bi bi-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
              Voltar para Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Modal para Nova Pessoa */} 
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"></div>
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-transparent rounded-xl flex flex-col transform transition-all animate-modalFadeIn">
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <PessoaForm
                onSubmit={async (data) => {
                    try {
                        await handleSalvarPessoa(data as CreatePessoaDTO);
                    } catch (e) { throw e; }
                }}
                onCancel={() => setModalOpen(false)}
                isEditMode={false}
                title="Cadastrar Nova Pessoa"
              />
            </div>
          </div>
        </div>
      )}

      {modalEditOpen && pessoaEmEdicao && (
         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"></div>
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-transparent rounded-xl flex flex-col transform transition-all animate-modalFadeIn">
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              <PessoaForm
                pessoa={pessoaEmEdicao}
                onSubmit={async (data) => {
                     try {
                        await handleSalvarEdicao(data as UpdatePessoaDTO);
                    } catch (e) { throw e; }
                }}
                onCancel={() => setModalEditOpen(false)}
                isEditMode={true}
                title="Editar Pessoa"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PessoasClient); 