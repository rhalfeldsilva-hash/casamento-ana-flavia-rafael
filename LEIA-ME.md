# Site do casamento: Ana Flávia e Rafael

## Arquivos
- `index.html`: o site inteiro
- `img/`: logo A&R (extraída do PDF original, sem alterações), foto do casal e aquarelas
- `img/convite.jpg`: **coloque aqui a imagem do convite** com exatamente esse nome. Enquanto ela não existir, a seção mostra só as informações.
- `fonts/`: fontes locais, sem depender de serviços externos
- `google-apps-script/Code.gs`: o script que grava as confirmações na planilha

## 1. Planilha de confirmações (uns 5 minutos)
1. Crie uma planilha nova no Google Sheets, por exemplo "Confirmações Casamento A&R".
2. Vá em **Extensões → Apps Script**, apague o conteúdo que aparece e cole o `Code.gs`. Depois salve.
3. Clique em **Implantar → Nova implantação**. Na engrenagem, escolha **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Autorize com sua conta Google. Em "app não verificado", clique em *Avançado → Acessar*.
5. Copie a URL que termina em `/exec`. No `index.html`, cole essa URL em `const ENDPOINT = "";`.

As abas **Confirmações** (uma linha por família) e **Convidados** (uma linha por pessoa) são criadas sozinhas na primeira resposta.
Para exportar: **Arquivo → Fazer download → Excel (.xlsx) ou CSV**.

## 2. Publicar (grátis)
- **GitHub Pages:** crie um repositório público, envie todos os arquivos e ative em *Settings → Pages → Branch: main / root*.
- **Netlify Drop:** em app.netlify.com/drop, arraste a pasta inteira.

## Antes de divulgar
Faça uma confirmação de teste e confira se ela aparece na planilha. Depois apague a linha de teste.
