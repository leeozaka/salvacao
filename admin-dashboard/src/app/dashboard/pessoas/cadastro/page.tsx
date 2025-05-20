import PessoasClient from '@/components/pessoa/PessoaClient';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cadastro de Pessoas | Dashboard',
  description: 'Gerencie cadastros de pessoas e usuários',
};

export default function PessoasCadastroPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Carregando...</div>}>
      <PessoasClient />
    </Suspense>
  );
}
