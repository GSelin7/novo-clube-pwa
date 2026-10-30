# ⭐ Novo Clube — Novo Shopping Ribeirão Preto (PWA)

Protótipo funcional de **Progressive Web App (PWA)** desenvolvido para o projeto experimental (TCC de Publicidade) de reposicionamento do **Novo Shopping Ribeirão Preto**.

---

## 🚀 Como executar localmente

O projeto foi construído sem dependências externas pesadas (**Zero-Dependency Vanilla HTML5 + CSS3 + ES6 JS**) para rodar instantaneamente em qualquer ambiente:

### Opção 1: Usando Python (Recomendado para testar Câmera e PWA)
```bash
python -m http.server 8080
```
Depois, acesse no navegador: **`http://localhost:8080`**

### Opção 2: Extensão Live Server (VS Code)
Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.

---

## ✨ Funcionalidades Implementadas

1. **Login e Cadastro Familiar (`Entrar` / `Criar Conta Grátis`)**
   - Validação sutil em tempo real nos campos.
   - Ao criar uma conta ou perfil, o **1º Astro (Astro Serviços — Amarelo)** já é desbloqueado automaticamente.
2. **Seleção de Perfis Estilo Netflix ("Quem está acessando?")**
   - Isolamento de perfis por conta de e-mail.
   - Suporte a múltiplos perfis da família na mesma conta, cada um com pontuação, saldo e coleção independentes.
3. **5 Páginas Principais Responsivas (Mobile, Tablet/Totem e Desktop)**
   - **Início:** Saudação personalizada, destaque do Astro Serviços e cards dos dois sistemas de pontos.
   - **Como funciona:** Explicação em 3 passos + comparativo visual entre *Pontos de Coleção* e *Saldo de Benefícios*.
   - **Benefícios:** Catálogo mensal (*Outubro*, *Novembro*, *Dezembro*), filtro por categorias, busca instantânea sem recarregar a tela e página interna de detalhes para resgate de ofertas.
   - **Coleção:** Jornada dos 4 Astros (*Serviços*, *Lazer*, *Esportes/Saúde*, *Compras/Varejo*) com barra de progresso, controle de liberação mensal e modal com as fotos reais da pelúcia física no Novo Shopping.
   - **Perfil:** Painel completo com KPIs, *Últimas movimentações*, *Minhas notas fiscais*, *Meus benefícios*, *Histórico de pontos*, *Colecionáveis*, *FAQ*, *Termos* e *Configurações*.
4. **Fluxo Global de Cadastro de Nota Fiscal (Câmera WebRTC / Upload)**
   - Regra `R$ 1,00 = 1 ponto`.
   - Alimenta simultaneamente os **Pontos de Coleção** (barra vermelha acumulativa que nunca diminui) e o **Saldo de Benefícios** (barra azul utilizada nos resgates).

---

## 📁 Estrutura de Pastas

```text
├── index.html               # Entrada principal da aplicação e metadados PWA
├── manifest.webmanifest     # Manifesto de instalação do Web App (PWA)
├── sw.js                    # Service Worker (Network-First + Cache Offline)
├── css/
│   └── styles.css           # Design System responsivo (Desktop, Tablet/Kiosk e Mobile)
├── js/
│   ├── data.js              # Dados iniciais (Astros, Benefícios por mês, Perfis, Lojas, FAQ)
│   └── app.js               # Motor de estado (LocalStorage), rotas, câmera e regras de negócio
└── assets/
    ├── icons/               # Ícones de instalação PWA (192x192, 512x512, Apple Touch)
    └── images/
        ├── astros/          # Renders 3D em alta definição (HD) dos 4 Astros
        ├── astros-reais/    # Fotos da pelúcia física ambientada no Novo Shopping
        └── beneficios/      # Fotografias gastronômicas e de serviços em alta definição (HD)
```
