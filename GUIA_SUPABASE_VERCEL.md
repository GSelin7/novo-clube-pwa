# 🚀 Guia de Integração: Supabase + Vercel

Este documento descreve os passos necessários após o aceite deste Pull Request para conectar o banco de dados **Supabase** ao projeto hospedado na **Vercel**.

---

## 📌 Visão Geral do Fluxo

1. **Criar o projeto no Supabase** (Banco de dados PostgreSQL + Auth + Storage).
2. **Obter as credenciais da API** no painel do Supabase.
3. **Adicionar as Variáveis de Ambiente na Vercel** para que o projeto tenha acesso aos dados em produção e nos previews.
4. **Configurar as tabelas e políticas de acesso (RLS)** no Supabase.

---

## 🛠️ Passo 1: Criar o Projeto no Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard) e faça login.
2. Clique em **"New Project"**.
3. Preencha as informações:
   - **Name:** `novo-clube-pwa` (ou o nome que preferir).
   - **Database Password:** Guarde essa senha com segurança.
   - **Region:** Selecione **São Paulo (`sa-east-1`)** para menor latência no Brasil.
4. Clique em **"Create new project"** e aguarde alguns minutos enquanto a infraestrutura é provisionada.

---

## 🔑 Passo 2: Copiar as Credenciais do Supabase

Após o projeto ser criado:
1. No menu lateral esquerdo, vá em **Project Settings** (ícone de engrenagem) > **API**.
2. Copie os seguintes valores:
   - **Project URL:** Exemplo `https://xyzcompany.supabase.co`
   - **`anon` `public` key:** Chave pública (usada pelo cliente / frontend).
   - **`service_role` `secret` key:** Chave de superadministrador (usada **apenas** em funções de backend serverless seguras; nunca compartilhe essa chave no código cliente).

---

## ⚙️ Passo 3: Cadastrar as Variáveis de Ambiente na Vercel

1. Acesse o painel da [Vercel](https://vercel.com/) e entre no projeto **novo-clube-pwa**.
2. Vá na aba **Settings** > **Environment Variables**.
3. Adicione as seguintes 3 variáveis (marque as opções **Production**, **Preview** e **Development**):

| Nome da Variável | Valor | Finalidade |
| :--- | :--- | :--- |
| `SUPABASE_URL` | *(Sua Project URL do Supabase)* | Endereço da API do banco |
| `SUPABASE_ANON_KEY` | *(Sua chave pública `anon`)* | Acesso com regras de segurança (RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Sua chave secreta `service_role`)* | Acesso administrativo no backend |

4. Salve as variáveis.

> [!TIP]
> **Opção de 1 clique:** Se preferir, no painel da Vercel você pode ir em **Integrations** > buscar **Supabase** e conectar diretamente a sua conta. A Vercel preenche essas variáveis automaticamente.

---

## 🗄️ Passo 4: Executar o Script do Banco de Dados no Supabase

O esquema completo do banco de dados já está pronto no arquivo:
👉 [**`supabase/schema.sql`**](./supabase/schema.sql)

Para aplicar:
1. No painel do Supabase, acesse **SQL Editor** no menu lateral.
2. Clique em **New query**.
3. Copie todo o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql), cole no editor e clique em **Run** (Ctrl + Enter).

Este script cria automaticamente:
* ✅ Todas as 7 tabelas em PT-BR (`perfis`, `lojas`, `notas_fiscais`, `beneficios`, `resgates`, `transacoes`, `astros`).
* ✅ **Índices de Performance:** Consultas otimizadas por perfil, timestamps, status e códigos de voucher.
* ✅ **Bucket Privado no Storage:** Bucket `notas-fiscais` para guarda segura das imagens dos comprovantes.
* ✅ **Políticas de Segurança (RLS):** Isolamento rigoroso dos dados por conta autenticada.
* ✅ **Funções Atômicas em PostgreSQL:**
  * `cadastrar_nota_fiscal`: valida prazo de 30 dias, bloqueia duplicidade de chave/CNPJ+número e credita os pontos atomicamente.
  * `resgatar_beneficio`: valida saldo, debita os pontos e gera o voucher com integridade.
  * `validar_e_utilizar_voucher`: valida a autenticidade do cupom e realiza a baixa pelo lojista ou totem.
* ✅ Carga inicial com as lojas participantes do Novo Shopping, regras dos 4 mascotes Astros e benefícios do catálogo.

---

## 🌐 Passo 5: Arquitetura do Backend Node.js em PT-BR (Serverless na Vercel)

O backend já está implementado e pronto na pasta [**`api/`**](./api):

* [`/api/autenticacao`](./api/autenticacao.js) — Login, cadastro de conta familiar e checagem de sessão.
* [`/api/perfis`](./api/perfis.js) — Gerenciamento de múltiplos perfis familiares sob o mesmo e-mail.
* [`/api/notas-fiscais`](./api/notas-fiscais.js) — Submissão de notas com regras antifraude e pontuação (`R$ 1 = 1 ponto`).
* [`/api/upload-url`](./api/upload-url.js) — Geração de URL assinada para envio seguro de fotos direto para o Supabase Storage.
* [`/api/beneficios`](./api/beneficios.js) — Consulta de benefícios por mês e categoria.
* [`/api/resgates`](./api/resgates.js) — Resgate com débito atômico de saldo e emissão de vouchers.
* [`/api/validar-voucher`](./api/validar-voucher.js) — Consulta (preview) e baixa definitiva do voucher pelo lojista na loja física.
* [`/api/transacoes`](./api/transacoes.js) — Extrato de movimentações (créditos e débitos).
* [`/api/astros`](./api/astros.js) — Status da jornada de desbloqueio dos 4 mascotes.
* [`/api/lojas`](./api/lojas.js) — Listagem de lojas participantes do Novo Shopping.

Assim que as variáveis de ambiente forem cadastradas na Vercel (Passo 3), esses endpoints estarão 100% operacionais em produção.

---

*Dúvidas ou alinhamentos sobre dados e rotas, combine diretamente nas issues/pull requests da branch principal.*
