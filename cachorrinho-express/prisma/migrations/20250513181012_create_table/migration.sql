-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('CPF', 'RG');

-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "SexoAnimal" AS ENUM ('MACHO', 'FEMEA', 'DESCONHECIDO');

-- CreateEnum
CREATE TYPE "PorteAnimal" AS ENUM ('MINI', 'PEQUENO', 'MEDIO', 'GRANDE', 'GIGANTE');

-- CreateEnum
CREATE TYPE "StatusAnimal" AS ENUM ('RESGATADO', 'EM_TRATAMENTO', 'DISPONIVEL_ADOCAO', 'EM_LAR_TEMPORARIO', 'ADOTADO', 'FALECIDO', 'EM_OBSERVACAO', 'PERDIDO', 'DEVOLVIDO');

-- CreateEnum
CREATE TYPE "StatusAdocao" AS ENUM ('SOLICITADA', 'EM_ANALISE', 'APROVADA', 'REJEITADA', 'CANCELADA', 'CONCLUIDA', 'ACOMPANHAMENTO', 'DEVOLVIDO');

-- CreateEnum
CREATE TYPE "TipoMoradia" AS ENUM ('CASA_COM_QUINTAL_TOTALMENTE_MURADO', 'CASA_COM_QUINTAL_PARCIALMENTE_MURADO', 'CASA_SEM_QUINTAL', 'APARTAMENTO_COM_TELA_PROTECAO', 'APARTAMENTO_SEM_TELA_PROTECAO', 'CHACARA', 'SITIO', 'FAZENDA', 'COMUNIDADE', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusAgendamento" AS ENUM ('AGENDADO', 'CONFIRMADO', 'REALIZADO', 'CANCELADO_PELO_USUARIO', 'CANCELADO_PELA_ONG', 'REAGENDADO', 'NAO_COMPARECEU', 'EM_ANDAMENTO');

-- CreateEnum
CREATE TYPE "TipoCompromisso" AS ENUM ('CONSULTA_VETERINARIA_ROTINA', 'CONSULTA_VETERINARIA_EMERGENCIA', 'VACINACAO', 'VERMIFUGACAO', 'CIRURGIA_CASTRACAO', 'CIRURGIA_GERAL', 'EXAME_LABORATORIAL', 'EXAME_IMAGEM', 'BANHO_E_TOSA', 'ENTREVISTA_ADOCAO_ADOTANTE', 'VISITA_PRE_ADOCAO_MORADIA', 'VISITA_ACOMPANHAMENTO_POS_ADOCAO', 'TRANSPORTE_ANIMAL', 'EVENTO_FEIRA_ADOCAO', 'TREINAMENTO_COMPORTAMENTAL', 'SESSAO_FISIOTERAPIA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoDoacao" AS ENUM ('MONETARIA_DINHEIRO', 'MONETARIA_PIX', 'MONETARIA_CARTAO_CREDITO', 'MONETARIA_BOLETO', 'PRODUTO_ALIMENTO', 'PRODUTO_MEDICAMENTO', 'PRODUTO_HIGIENE_LIMPEZA', 'PRODUTO_ACESSORIO_BRINQUEDO', 'PRODUTO_MATERIAL_CONSTRUCAO_REFORMA', 'SERVICO_VETERINARIO', 'SERVICO_TRANSPORTE', 'SERVICO_LAR_TEMPORARIO', 'SERVICO_TREINAMENTO', 'SERVICO_DIVULGACAO_MARKETING', 'SERVICO_FOTOGRAFIA_VIDEO', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoInteracao" AS ENUM ('TELEFONEMA_REALIZADO', 'TELEFONEMA_RECEBIDO', 'MENSAGEM_TEXTO_WHATSAPP_ENVIADA', 'MENSAGEM_TEXTO_WHATSAPP_RECEBIDA', 'EMAIL_ENVIADO', 'EMAIL_RECEBIDO', 'VISITA_PRESENCIAL_REALIZADA_NA_ONG', 'VISITA_PRESENCIAL_REALIZADA_EXTERNA', 'VIDEO_CHAMADA_REALIZADA', 'CONTATO_REDES_SOCIAIS', 'RELATORIO_ESCRITO', 'OUTRO');

-- CreateEnum
CREATE TYPE "ViaAdministracaoMedicamento" AS ENUM ('ORAL_COMPRIMIDO', 'ORAL_LIQUIDO', 'ORAL_PASTA', 'INTRAMUSCULAR', 'SUBCUTANEA', 'INTRAVENOSA', 'TOPICA_PELE', 'TOPICA_OCULAR', 'TOPICA_AURICULAR', 'INALATORIA', 'RETAL', 'OUTRA');

-- CreateTable
CREATE TABLE "pessoa" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "documento_identidade" VARCHAR(50),
    "tipo_documento" "TipoDocumento",
    "email" VARCHAR(255),
    "telefone" VARCHAR(30),
    "endereco" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "id_pessoa" INTEGER NOT NULL,
    "tipo_usuario" "TipoUsuario" NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adotante" (
    "id" SERIAL NOT NULL,
    "id_pessoa" INTEGER NOT NULL,
    "motivacao_adocao" TEXT,
    "experiencia_anterior_animais" TEXT,
    "tipo_moradia" "TipoMoradia",
    "permite_animais_moradia" BOOLEAN,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "adotante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animal" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255),
    "raca" VARCHAR(100) DEFAULT 'SRD',
    "data_nascimento_estimada" DATE,
    "sexo" "SexoAnimal",
    "cor" VARCHAR(100),
    "pelagem" VARCHAR(100),
    "porte" "PorteAnimal",
    "microchip_id" VARCHAR(50),
    "esterilizado" BOOLEAN DEFAULT false,
    "data_esterilizacao" DATE,
    "status_animal" "StatusAnimal" NOT NULL DEFAULT 'RESGATADO',
    "data_resgate" DATE,
    "local_resgate" TEXT,
    "descricao_comportamental" TEXT,
    "observacoes_saude_entrada" TEXT,
    "foto_principal_url" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_animal" (
    "id" SERIAL NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "data_evento" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_evento" VARCHAR(100) NOT NULL,
    "descricao_detalhada" TEXT NOT NULL,
    "id_usuario_responsavel" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "historico_animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adocao" (
    "id" SERIAL NOT NULL,
    "id_adotante" INTEGER NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "data_solicitacao_adocao" DATE NOT NULL,
    "data_efetivacao_adocao" DATE,
    "status_adocao" "StatusAdocao" NOT NULL DEFAULT 'SOLICITADA',
    "observacoes_processo" TEXT,
    "id_usuario_responsavel" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "adocao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_produto" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "tipo_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidade_medida" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "sigla" VARCHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "unidade_medida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "id_tipo_produto" INTEGER NOT NULL,
    "id_unidade_medida_padrao" INTEGER NOT NULL,
    "descricao" TEXT,
    "codigo_barras" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicamento_detalhe" (
    "id_produto" INTEGER NOT NULL,
    "dosagem" VARCHAR(100),
    "principio_ativo" VARCHAR(255),
    "fabricante" VARCHAR(255),
    "necessita_receita" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "medicamento_detalhe_pkey" PRIMARY KEY ("id_produto")
);

-- CreateTable
CREATE TABLE "vacina_detalhe" (
    "id_produto" INTEGER NOT NULL,
    "tipo_vacina" VARCHAR(100) NOT NULL,
    "fabricante" VARCHAR(255),
    "numero_doses_serie" INTEGER DEFAULT 1,
    "intervalo_entre_doses_dias" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "vacina_detalhe_pkey" PRIMARY KEY ("id_produto")
);

-- CreateTable
CREATE TABLE "estoque" (
    "id" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL,
    "id_unidade_medida" INTEGER NOT NULL,
    "lote" VARCHAR(100),
    "data_validade" DATE,
    "data_entrada_estoque" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preco_custo" DECIMAL(10,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receita" (
    "id" SERIAL NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "id_veterinario_usuario" INTEGER NOT NULL,
    "data_emissao" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instrucoes_adicionais" TEXT,
    "validade_receita" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "receita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posologia" (
    "id" SERIAL NOT NULL,
    "descricao_posologia" VARCHAR(255) NOT NULL,
    "dose" VARCHAR(100) NOT NULL,
    "frequencia_horas" INTEGER,
    "duracao_dias" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "posologia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receita_item" (
    "id" SERIAL NOT NULL,
    "id_receita" INTEGER NOT NULL,
    "id_medicamento_produto" INTEGER NOT NULL,
    "id_posologia" INTEGER,
    "posologia_customizada_instrucoes" TEXT,
    "quantidade_prescrita" VARCHAR(50),
    "observacoes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "receita_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administracao_medicamento" (
    "id" SERIAL NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "id_medicamento_produto" INTEGER NOT NULL,
    "id_receita_item" INTEGER,
    "data_administracao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dose_administrada" VARCHAR(100) NOT NULL,
    "via_administracao" "ViaAdministracaoMedicamento",
    "id_usuario_administrador" INTEGER NOT NULL,
    "id_estoque_utilizado" INTEGER,
    "observacoes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "administracao_medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_vacinacao" (
    "id" SERIAL NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "id_vacina_produto" INTEGER NOT NULL,
    "id_estoque_utilizado" INTEGER,
    "data_vacinacao" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dose_aplicada" VARCHAR(50),
    "proxima_dose_data_prevista" DATE,
    "id_profissional_responsavel_usuario" INTEGER NOT NULL,
    "local_aplicacao" VARCHAR(100),
    "observacoes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "registro_vacinacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento_compromisso" (
    "id" SERIAL NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "tipo_compromisso" "TipoCompromisso" NOT NULL,
    "id_produto_associado" INTEGER,
    "data_hora_agendada" TIMESTAMP(6) NOT NULL,
    "status_agendamento" "StatusAgendamento" NOT NULL DEFAULT 'AGENDADO',
    "id_usuario_responsavel_agendamento" INTEGER,
    "id_usuario_profissional_designado" INTEGER,
    "observacoes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "agendamento_compromisso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lar_temporario" (
    "id" SERIAL NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "id_pessoa_responsavel" INTEGER NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_fim_prevista" DATE,
    "data_fim_real" DATE,
    "condicoes_acordadas" TEXT,
    "observacoes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "lar_temporario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doacao" (
    "id" SERIAL NOT NULL,
    "id_pessoa_doador" INTEGER,
    "nome_doador_anonimo" VARCHAR(255),
    "data_doacao" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_doacao" "TipoDoacao" NOT NULL,
    "descricao_doacao" TEXT,
    "valor_monetario" DECIMAL(10,2),
    "id_produto_doado" INTEGER,
    "id_estoque_doado" INTEGER,
    "quantidade_produto_doado" DECIMAL(10,2),
    "id_unidade_medida_produto_doado" INTEGER,
    "id_usuario_recebedor" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "doacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_despesa" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "tipo_despesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despesa" (
    "id" SERIAL NOT NULL,
    "data_despesa" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "id_tipo_despesa" INTEGER NOT NULL,
    "id_animal_associado" INTEGER,
    "id_fornecedor_pessoa" INTEGER,
    "comprovante_url" VARCHAR(255),
    "id_usuario_registrou" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "despesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foto_animal" (
    "id" SERIAL NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "url_foto" VARCHAR(255) NOT NULL,
    "legenda" TEXT,
    "data_upload" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_principal" BOOLEAN DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "foto_animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interacao_acompanhamento" (
    "id" SERIAL NOT NULL,
    "id_animal" INTEGER NOT NULL,
    "id_adocao" INTEGER,
    "id_lar_temporario" INTEGER,
    "data_interacao" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo_interacao" "TipoInteracao" NOT NULL,
    "resumo_interacao" TEXT NOT NULL,
    "id_usuario_responsavel" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "interacao_acompanhamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_documento_identidade_key" ON "pessoa"("documento_identidade");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_email_key" ON "pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_id_pessoa_key" ON "usuario"("id_pessoa");

-- CreateIndex
CREATE UNIQUE INDEX "adotante_id_pessoa_key" ON "adotante"("id_pessoa");

-- CreateIndex
CREATE UNIQUE INDEX "animal_microchip_id_key" ON "animal"("microchip_id");

-- CreateIndex
CREATE UNIQUE INDEX "adocao_id_animal_key" ON "adocao"("id_animal");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_produto_nome_key" ON "tipo_produto"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_medida_nome_key" ON "unidade_medida"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "unidade_medida_sigla_key" ON "unidade_medida"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "produto_codigo_barras_key" ON "produto"("codigo_barras");

-- CreateIndex
CREATE UNIQUE INDEX "produto_nome_id_tipo_produto_key" ON "produto"("nome", "id_tipo_produto");

-- CreateIndex
CREATE UNIQUE INDEX "posologia_descricao_posologia_key" ON "posologia"("descricao_posologia");

-- CreateIndex
CREATE UNIQUE INDEX "lar_temporario_id_animal_key" ON "lar_temporario"("id_animal");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_despesa_nome_key" ON "tipo_despesa"("nome");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adotante" ADD CONSTRAINT "adotante_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_animal" ADD CONSTRAINT "historico_animal_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_animal" ADD CONSTRAINT "historico_animal_id_usuario_responsavel_fkey" FOREIGN KEY ("id_usuario_responsavel") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adocao" ADD CONSTRAINT "adocao_id_adotante_fkey" FOREIGN KEY ("id_adotante") REFERENCES "adotante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adocao" ADD CONSTRAINT "adocao_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adocao" ADD CONSTRAINT "adocao_id_usuario_responsavel_fkey" FOREIGN KEY ("id_usuario_responsavel") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_id_tipo_produto_fkey" FOREIGN KEY ("id_tipo_produto") REFERENCES "tipo_produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_id_unidade_medida_padrao_fkey" FOREIGN KEY ("id_unidade_medida_padrao") REFERENCES "unidade_medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamento_detalhe" ADD CONSTRAINT "medicamento_detalhe_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacina_detalhe" ADD CONSTRAINT "vacina_detalhe_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque" ADD CONSTRAINT "estoque_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque" ADD CONSTRAINT "estoque_id_unidade_medida_fkey" FOREIGN KEY ("id_unidade_medida") REFERENCES "unidade_medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita" ADD CONSTRAINT "receita_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita" ADD CONSTRAINT "receita_id_veterinario_usuario_fkey" FOREIGN KEY ("id_veterinario_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita_item" ADD CONSTRAINT "receita_item_id_receita_fkey" FOREIGN KEY ("id_receita") REFERENCES "receita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita_item" ADD CONSTRAINT "receita_item_id_medicamento_produto_fkey" FOREIGN KEY ("id_medicamento_produto") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receita_item" ADD CONSTRAINT "receita_item_id_posologia_fkey" FOREIGN KEY ("id_posologia") REFERENCES "posologia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administracao_medicamento" ADD CONSTRAINT "administracao_medicamento_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administracao_medicamento" ADD CONSTRAINT "administracao_medicamento_id_medicamento_produto_fkey" FOREIGN KEY ("id_medicamento_produto") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administracao_medicamento" ADD CONSTRAINT "administracao_medicamento_id_receita_item_fkey" FOREIGN KEY ("id_receita_item") REFERENCES "receita_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administracao_medicamento" ADD CONSTRAINT "administracao_medicamento_id_usuario_administrador_fkey" FOREIGN KEY ("id_usuario_administrador") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administracao_medicamento" ADD CONSTRAINT "administracao_medicamento_id_estoque_utilizado_fkey" FOREIGN KEY ("id_estoque_utilizado") REFERENCES "estoque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_vacinacao" ADD CONSTRAINT "registro_vacinacao_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_vacinacao" ADD CONSTRAINT "registro_vacinacao_id_vacina_produto_fkey" FOREIGN KEY ("id_vacina_produto") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_vacinacao" ADD CONSTRAINT "registro_vacinacao_id_estoque_utilizado_fkey" FOREIGN KEY ("id_estoque_utilizado") REFERENCES "estoque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_vacinacao" ADD CONSTRAINT "registro_vacinacao_id_profissional_responsavel_usuario_fkey" FOREIGN KEY ("id_profissional_responsavel_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_compromisso" ADD CONSTRAINT "agendamento_compromisso_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_compromisso" ADD CONSTRAINT "agendamento_compromisso_id_produto_associado_fkey" FOREIGN KEY ("id_produto_associado") REFERENCES "produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_compromisso" ADD CONSTRAINT "agendamento_compromisso_id_usuario_responsavel_agendamento_fkey" FOREIGN KEY ("id_usuario_responsavel_agendamento") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_compromisso" ADD CONSTRAINT "agendamento_compromisso_id_usuario_profissional_designado_fkey" FOREIGN KEY ("id_usuario_profissional_designado") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lar_temporario" ADD CONSTRAINT "lar_temporario_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lar_temporario" ADD CONSTRAINT "lar_temporario_id_pessoa_responsavel_fkey" FOREIGN KEY ("id_pessoa_responsavel") REFERENCES "pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao" ADD CONSTRAINT "doacao_id_pessoa_doador_fkey" FOREIGN KEY ("id_pessoa_doador") REFERENCES "pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao" ADD CONSTRAINT "doacao_id_produto_doado_fkey" FOREIGN KEY ("id_produto_doado") REFERENCES "produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao" ADD CONSTRAINT "doacao_id_estoque_doado_fkey" FOREIGN KEY ("id_estoque_doado") REFERENCES "estoque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao" ADD CONSTRAINT "doacao_id_unidade_medida_produto_doado_fkey" FOREIGN KEY ("id_unidade_medida_produto_doado") REFERENCES "unidade_medida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doacao" ADD CONSTRAINT "doacao_id_usuario_recebedor_fkey" FOREIGN KEY ("id_usuario_recebedor") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despesa" ADD CONSTRAINT "despesa_id_tipo_despesa_fkey" FOREIGN KEY ("id_tipo_despesa") REFERENCES "tipo_despesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despesa" ADD CONSTRAINT "despesa_id_animal_associado_fkey" FOREIGN KEY ("id_animal_associado") REFERENCES "animal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despesa" ADD CONSTRAINT "despesa_id_fornecedor_pessoa_fkey" FOREIGN KEY ("id_fornecedor_pessoa") REFERENCES "pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despesa" ADD CONSTRAINT "despesa_id_usuario_registrou_fkey" FOREIGN KEY ("id_usuario_registrou") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foto_animal" ADD CONSTRAINT "foto_animal_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacao_acompanhamento" ADD CONSTRAINT "interacao_acompanhamento_id_animal_fkey" FOREIGN KEY ("id_animal") REFERENCES "animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacao_acompanhamento" ADD CONSTRAINT "interacao_acompanhamento_id_adocao_fkey" FOREIGN KEY ("id_adocao") REFERENCES "adocao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacao_acompanhamento" ADD CONSTRAINT "interacao_acompanhamento_id_lar_temporario_fkey" FOREIGN KEY ("id_lar_temporario") REFERENCES "lar_temporario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacao_acompanhamento" ADD CONSTRAINT "interacao_acompanhamento_id_usuario_responsavel_fkey" FOREIGN KEY ("id_usuario_responsavel") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
