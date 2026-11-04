# Reels Blocker

Extensão de navegador para uso pessoal no Opera GX. Bloqueia Reels (Instagram) e Shorts (YouTube) e esconde os elementos da interface que levam a eles.

O restante dos sites continua normal: vídeos do YouTube (`/watch?v=`), feed e stories do Instagram.

## O que é bloqueado

| Rota | Como é bloqueada |
| --- | --- |
| `youtube.com/shorts/*` (com `www.`, sem `www.` e `m.`) | Abre `blocked.html` |
| `instagram.com/reels/` e `instagram.com/reels/*` | Abre `blocked.html` |
| `instagram.com/reel/*` e `instagram.com/<usuário>/reel/*` | Abre `blocked.html` |

A interface esconde prateleiras e itens de Shorts, a entrada "Shorts" das barras laterais, a aba "Shorts" dos canais, o link de Reels da navegação do Instagram e a aba de Reels dos perfis.

## Como carregar no Opera GX

1. Abra `opera://extensions`.
2. Ative **Developer mode** (Modo de desenvolvedor).
3. Clique em **Load unpacked** (Carregar sem compactação) e selecione a pasta `reels-blocker`.

Depois de editar um arquivo, clique no botão de recarregar do card da extensão e recarregue as abas do YouTube e do Instagram. Sem recarregar a aba, o CSS novo não é aplicado nela.

## Como funciona

- `rules.json`: redireciona navegações completas, como digitar o endereço ou abrir um link.
- `background.js`: redireciona trocas de rota sem recarregar a página (`history.pushState`), que as regras de `rules.json` não enxergam.
- `hide-youtube.css` e `hide-instagram.css`: escondem os elementos da interface.
- `blocked.html`, `blocked.css` e `blocked.js`: página exibida ao bloquear.

Os padrões de URL existem em dois lugares: `regexFilter` em `rules.json` e `BLOCKED_URL_PATTERNS` em `background.js`. Ao alterar um, altere o outro com a mesma expressão.

## Como depurar

- **Console do service worker:** em `opera://extensions`, clique em **service worker** no card da extensão. Mostra erros e avisos de `background.js`, como falhas ao redirecionar uma aba.
- **Console da aba:** abra o DevTools (`F12`) na página do YouTube ou do Instagram para inspecionar elementos e testar seletores. Erros de `blocked.js` aparecem no console da própria página de bloqueio.
- **Erros da extensão:** o botão **Errors** no card lista os problemas ao carregar, como um `rules.json` inválido.

## Como atualizar os seletores

YouTube e Instagram mudam o HTML com frequência. Quando algo voltar a aparecer:

1. Clique com o botão direito no elemento e escolha **Inspecionar**.
2. Encontre um ancestral estável:
   - **YouTube:** nomes de componentes (`ytd-*`, `ytm-*`, `yt-*`) e atributos como `tab-title`.
   - **Instagram:** `href` e `aria-label`. As classes são ofuscadas e mudam, então não as use.
3. Teste o seletor no console da aba antes de editar o CSS:

   ```js
   document.querySelectorAll('SEU_SELETOR')
   ```

4. Coloque o seletor no grupo certo de `hide-youtube.css` ou `hide-instagram.css`.
5. Recarregue a extensão e a aba.

Cuidados:

- Nunca use um contêiner genérico com `:has()` sem limitar a profundidade, como `div:has(a[href="/reels/"])`. Ele também pega todos os ancestrais e esconde a página inteira.
- `tab-title` e `aria-label` dependem do idioma da conta. "Shorts" e "Reels" são iguais em português e inglês, mas podem mudar em outros idiomas.

## Limitações conhecidas

- **Links vindos de outros sites:** um link para um Short ou Reel em outro site (Google, WhatsApp Web etc.) continua bloqueado, mas mostra a página de erro do navegador (`ERR_BLOCKED_BY_CLIENT`) em vez de `blocked.html`. Para mostrar `blocked.html` também nesses casos, troque `matches` em `web_accessible_resources` no `manifest.json` por `["<all_urls>"]`.
- **Listagens dentro de perfis e canais:** `youtube.com/@canal/shorts` e `instagram.com/<usuário>/reels/` não são rotas bloqueadas. No YouTube a grade aparece vazia; no Instagram, a listagem de um perfil continua acessível pelo endereço direto, mas abrir um reel a partir dela é bloqueado.
- **Filtro "Shorts" na busca do YouTube:** o botão continua visível, porque não foi identificado um seletor CSS estável para ele.
- **YouTube mobile (`m.youtube.com`):** a rota é bloqueada, mas o CSS só cobre a versão desktop.
