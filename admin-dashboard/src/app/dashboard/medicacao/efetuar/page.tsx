// import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

// // Importação das interfaces
// import {
//   Animal,
//   Pessoa,
//   UnidadeDeMedida,
//   ReceitaMedicamento,
// } from "@/types/entities";

// import { Medicamento } from "@/types/medicamento/medicamento";

// import { ViaAdministracaoType, FormDataType } from "@/types/formTypes";

// // Importação dos serviços
// import {
//   buscarAnimais,
//   buscarMedicamentos,
//   buscarUnidadesDeMedida,
//   buscarResponsaveis,
//   buscarReceitas,
//   registrarMedicacao,
// } from "@/services/medicacaoService";

// const RegistroMedicacao: React.FC = () => {
//   // Estados para controlar os dados do formulário
//   const [animais, setAnimais] = useState<Animal[]>([]);
//   const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
//   const [unidadesDeMedida, setUnidadesDeMedida] = useState<UnidadeDeMedida[]>(
//     [],
//   );
//   const [responsaveis, setResponsaveis] = useState<Pessoa[]>([]);
//   const [receitas, setReceitas] = useState<ReceitaMedicamento[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [success, setSuccess] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   // Estado para armazenar os dados do formulário
//   const [formData, setFormData] = useState<FormDataType>({
//     animalId: "",
//     medicamentoId: "",
//     dose: "",
//     unidadeId: "",
//     data: new Date().toISOString().split("T")[0],
//     hora: new Date().toTimeString().slice(0, 5),
//     observacoes: "",
//     viaAdministracao: "oral",
//     responsavelId: "",
//     receitaId: "",
//     quantidadeDias: "",
//     intervaloHoras: "",
//   });

//   // Efeito para carregar os dados iniciais
//   useEffect(() => {
//     // Função para carregar todos os dados necessários
//     const carregarDados = async () => {
//       try {
//         // Buscar todos os dados em paralelo
//         const [
//           animaisData,
//           medicamentosData,
//           unidadesData,
//           responsaveisData,
//           receitasData,
//         ] = await Promise.all([
//           buscarAnimais(),
//           buscarMedicamentos(),
//           buscarUnidadesDeMedida(),
//           buscarResponsaveis(),
//           buscarReceitas(),
//         ]);

//         // Atualizar os estados com os dados recebidos
//         setAnimais(animaisData);
//         setMedicamentos(medicamentosData);
//         setUnidadesDeMedida(unidadesData);
//         setResponsaveis(responsaveisData);
//         setReceitas(receitasData);
//       } catch (error) {
//         console.error("Erro ao carregar dados iniciais:", error);
//         setError("Falha ao carregar dados. Por favor, tente novamente.");
//       }
//     };

//     carregarDados();
//   }, []);

//   // Função para lidar com mudanças nos campos do formulário
//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Função para lidar com o envio do formulário
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess(false);

//     // Validação básica
//     if (
//       !formData.animalId ||
//       !formData.medicamentoId ||
//       !formData.dose ||
//       !formData.unidadeId
//     ) {
//       setError("Por favor, preencha todos os campos obrigatórios.");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Chamar o serviço para registrar a medicação
//       const resultado = await registrarMedicacao(formData);

//       if (resultado.success) {
//         setSuccess(true);
//         // Resetar o formulário após sucesso
//         setFormData({
//           animalId: "",
//           medicamentoId: "",
//           dose: "",
//           unidadeId: "",
//           data: new Date().toISOString().split("T")[0],
//           hora: new Date().toTimeString().slice(0, 5),
//           observacoes: "",
//           viaAdministracao: "oral",
//           responsavelId: "",
//           receitaId: "",
//           quantidadeDias: "",
//           intervaloHoras: "",
//         });
//       } else {
//         setError(resultado.error || "Erro ao registrar medicação.");
//       }
//     } catch (error) {
//       setError("Ocorreu um erro ao processar a requisição.");
//       console.error("Erro no handleSubmit:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Encontrar os detalhes do animal selecionado
//   const animalSelecionado = formData.animalId
//     ? animais.find((animal) => animal.idanimal === Number(formData.animalId))
//     : null;

//   // Encontrar os detalhes do medicamento selecionado
//   const medicamentoSelecionado = formData.medicamentoId
//     ? medicamentos.find(
//         (med) => med.idproduto === Number(formData.medicamentoId),
//       )
//     : null;

//   // Encontrar a unidade de medida selecionada
//   const unidadeSelecionada = formData.unidadeId
//     ? unidadesDeMedida.find(
//         (unidade) => unidade.idunidademedida === Number(formData.unidadeId),
//       )
//     : null;

//   // Encontrar o responsável selecionado
//   const responsavelSelecionado = formData.responsavelId
//     ? responsaveis.find(
//         (pessoa) => pessoa.idpessoa === Number(formData.responsavelId),
//       )
//     : null;

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
//       <div className="flex items-center mb-6">
//         <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 text-amber-600 mr-3">
//           <i className="bi bi-capsule"></i>
//         </div>
//         <h2 className="text-xl font-semibold text-gray-800">
//           Registro de Medicação
//         </h2>
//       </div>

//       {success && (
//         <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 flex items-center">
//           <i className="bi bi-check-circle mr-2"></i>
//           <span>Medicação registrada com sucesso!</span>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex items-center">
//           <i className="bi bi-exclamation-circle mr-2"></i>
//           <span>{error}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Seleção do Animal */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-1"
//               htmlFor="animalId"
//             >
//               Animal <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="animalId"
//               name="animalId"
//               value={formData.animalId}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//               required
//             >
//               <option value="">Selecione o animal</option>
//               {animais.map((animal) => (
//                 <option key={animal.idanimal} value={animal.idanimal}>
//                   {animal.nome} ({animal.especie}, {animal.idade} ano(s),{" "}
//                   {animal.raca})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Seleção do Medicamento */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-1"
//               htmlFor="medicamentoId"
//             >
//               Medicamento <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="medicamentoId"
//               name="medicamentoId"
//               value={formData.medicamentoId}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//               required
//             >
//               <option value="">Selecione o medicamento</option>
//               {medicamentos.map((med) => (
//                 <option key={med.idproduto} value={med.idproduto}>
//                   {med.nome} ({med.composicao})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Dose e Unidade */}
//           <div className="flex space-x-3">
//             <div className="flex-1">
//               <label
//                 className="block text-sm font-medium text-gray-700 mb-1"
//                 htmlFor="dose"
//               >
//                 Dose <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="dose"
//                 name="dose"
//                 value={formData.dose}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 min="0"
//                 step="0.1"
//                 required
//               />
//             </div>
//             <div className="w-36">
//               <label
//                 className="block text-sm font-medium text-gray-700 mb-1"
//                 htmlFor="unidadeId"
//               >
//                 Unidade <span className="text-red-500">*</span>
//               </label>
//               <select
//                 id="unidadeId"
//                 name="unidadeId"
//                 value={formData.unidadeId}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//               >
//                 <option value="">Selecione</option>
//                 {unidadesDeMedida.map((unidade) => (
//                   <option
//                     key={unidade.idunidademedida}
//                     value={unidade.idunidademedida}
//                   >
//                     {unidade.descricao}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Via de Administração */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-1"
//               htmlFor="viaAdministracao"
//             >
//               Via de Administração
//             </label>
//             <select
//               id="viaAdministracao"
//               name="viaAdministracao"
//               value={formData.viaAdministracao}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//             >
//               <option value="oral">Oral</option>
//               <option value="injetável">Injetável</option>
//               <option value="tópica">Tópica</option>
//               <option value="ocular">Ocular</option>
//               <option value="auricular">Auricular</option>
//             </select>
//           </div>

//           {/* Data e Hora */}
//           <div className="flex space-x-3">
//             <div className="flex-1">
//               <label
//                 className="block text-sm font-medium text-gray-700 mb-1"
//                 htmlFor="data"
//               >
//                 Data <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="data"
//                 name="data"
//                 value={formData.data}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//               />
//             </div>
//             <div className="flex-1">
//               <label
//                 className="block text-sm font-medium text-gray-700 mb-1"
//                 htmlFor="hora"
//               >
//                 Hora <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="time"
//                 id="hora"
//                 name="hora"
//                 value={formData.hora}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                 required
//               />
//             </div>
//           </div>

//           {/* Responsável */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-1"
//               htmlFor="responsavelId"
//             >
//               Responsável pela Aplicação
//             </label>
//             <select
//               id="responsavelId"
//               name="responsavelId"
//               value={formData.responsavelId}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//             >
//               <option value="">Selecione o responsável</option>
//               {responsaveis.map((pessoa) => (
//                 <option key={pessoa.idpessoa} value={pessoa.idpessoa}>
//                   {pessoa.nome}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Receita Médica */}
//           <div>
//             <label
//               className="block text-sm font-medium text-gray-700 mb-1"
//               htmlFor="receitaId"
//             >
//               Receita Médica
//             </label>
//             <select
//               id="receitaId"
//               name="receitaId"
//               value={formData.receitaId}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//             >
//               <option value="">Selecione a receita (opcional)</option>
//               {receitas.map((receita) => (
//                 <option key={receita.idreceita} value={receita.idreceita}>
//                   {receita.medico} -{" "}
//                   {new Date(receita.data).toLocaleDateString()} -{" "}
//                   {receita.clinica}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Campos de Posologia - Exibidos apenas se uma receita for selecionada */}
//           {formData.receitaId && (
//             <>
//               <div>
//                 <label
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                   htmlFor="quantidadeDias"
//                 >
//                   Quantidade de Dias
//                 </label>
//                 <input
//                   type="number"
//                   id="quantidadeDias"
//                   name="quantidadeDias"
//                   value={formData.quantidadeDias}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   min="1"
//                 />
//               </div>
//               <div>
//                 <label
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                   htmlFor="intervaloHoras"
//                 >
//                   Intervalo (horas)
//                 </label>
//                 <input
//                   type="number"
//                   id="intervaloHoras"
//                   name="intervaloHoras"
//                   value={formData.intervaloHoras}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//                   min="1"
//                 />
//               </div>
//             </>
//           )}

//           {/* Observações */}
//           <div className="md:col-span-2">
//             <label
//               className="block text-sm font-medium text-gray-700 mb-1"
//               htmlFor="observacoes"
//             >
//               Observações
//             </label>
//             <textarea
//               id="observacoes"
//               name="observacoes"
//               value={formData.observacoes}
//               onChange={handleChange}
//               rows={3}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
//               placeholder="Informações adicionais sobre a medicação..."
//             ></textarea>
//           </div>
//         </div>

//         {/* Resumo da medicação */}
//         {animalSelecionado &&
//           medicamentoSelecionado &&
//           formData.dose &&
//           unidadeSelecionada && (
//             <div className="mt-6 p-4 bg-amber-50 rounded-md border border-amber-100">
//               <h3 className="font-medium text-amber-800 mb-2">
//                 Resumo da medicação
//               </h3>
//               <p className="text-gray-700">
//                 Aplicar{" "}
//                 <span className="font-medium">
//                   {formData.dose} {unidadeSelecionada.descricao}
//                 </span>{" "}
//                 de{" "}
//                 <span className="font-medium">
//                   {medicamentoSelecionado.nome}
//                 </span>{" "}
//                 via{" "}
//                 <span className="font-medium">{formData.viaAdministracao}</span>{" "}
//                 no animal{" "}
//                 <span className="font-medium">{animalSelecionado.nome}</span> (
//                 {animalSelecionado.especie}, {animalSelecionado.raca}).
//                 {responsavelSelecionado && (
//                   <>
//                     {" "}
//                     Responsável:{" "}
//                     <span className="font-medium">
//                       {responsavelSelecionado.nome}
//                     </span>
//                     .
//                   </>
//                 )}
//                 {responsavelSelecionado && (
//                   <>
//                     {" "}
//                     Responsável:{" "}
//                     <span className="font-medium">
//                       {responsavelSelecionado.nome}
//                     </span>
//                     .
//                   </>
//                 )}
//                 {formData.receitaId &&
//                   formData.quantidadeDias &&
//                   formData.intervaloHoras && (
//                     <>
//                       {" "}
//                       Tratamento:{" "}
//                       <span className="font-medium">
//                         {formData.quantidadeDias} dias
//                       </span>
//                       , a cada{" "}
//                       <span className="font-medium">
//                         {formData.intervaloHoras} horas
//                       </span>
//                       .
//                     </>
//                   )}
//               </p>
//             </div>
//           )}

//         <div className="mt-6 flex justify-end space-x-3">
//           <button
//             type="button"
//             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//             onClick={() => window.history.back()}
//           >
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="flex items-center">
//                 <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
//                 Registrando...
//               </span>
//             ) : (
//               "Registrar Medicação"
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegistroMedicacao;
