// src/services/cepService.ts
export const buscarCEP = async (cep: string) => {
  const sanitizedCEP = cep.replace(/\D/g, '');

  if (sanitizedCEP.length !== 8) {
    throw new Error("CEP inválido");
  }

  const response = await fetch(`https://viacep.com.br/ws/${sanitizedCEP}/json/`);
  
  if (!response.ok) {
    throw new Error("Erro ao buscar CEP");
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error("CEP não encontrado");
  }

  return {
    logradouro: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf
  };
};
