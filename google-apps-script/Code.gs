/**
 * Recebe as confirmações de presença do site e grava na planilha.
 *
 * Aba "Confirmações": uma linha por família (quem confirmou, totais, nomes).
 * Aba "Convidados":   uma linha por pessoa (fácil de contar, filtrar e exportar).
 */

const ABA_FAMILIAS = 'Confirmações';
const ABA_PESSOAS = 'Convidados';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const familias = aba_(ss, ABA_FAMILIAS, [
      'Data/hora', 'Responsável', 'Presença', 'Nº acompanhantes', 'Acompanhantes',
      'Nº crianças', 'Crianças (idade)', 'Total de pessoas'
    ]);
    const pessoas = aba_(ss, ABA_PESSOAS, [
      'Data/hora', 'Família (responsável)', 'Nome', 'Tipo', 'Idade', 'Presença'
    ]);

    const agora = new Date();
    const resp = limpa_(d.responsavel);
    const presenca = d.presenca === 'Sim' ? 'Sim' : 'Não';
    const acomp = (d.acompanhantes || []).map(limpa_).filter(String);
    const criancas = (d.criancas || []).map(c => ({ nome: limpa_(c.nome), idade: limpa_(c.idade) })).filter(c => c.nome);
    const total = presenca === 'Sim' ? 1 + acomp.length + criancas.length : 0;

    familias.appendRow([
      agora, resp, presenca, acomp.length, acomp.join(', '),
      criancas.length, criancas.map(c => c.nome + ' (' + c.idade + ')').join(', '), total
    ]);

    const linhas = [[agora, resp, resp, 'Responsável', '', presenca]];
    acomp.forEach(n => linhas.push([agora, resp, n, 'Acompanhante', '', presenca]));
    criancas.forEach(c => linhas.push([agora, resp, c.nome, 'Criança', c.idade, presenca]));
    pessoas.getRange(pessoas.getLastRow() + 1, 1, linhas.length, linhas[0].length).setValues(linhas);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, erro: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Abrir a URL /exec no navegador só mostra que está funcionando.
function doGet() {
  return ContentService.createTextOutput('Confirmações de presença: ativo.');
}

function aba_(ss, nome, cabecalho) {
  let sh = ss.getSheetByName(nome);
  if (!sh) sh = ss.insertSheet(nome);
  if (sh.getLastRow() === 0) {
    sh.appendRow(cabecalho);
    sh.getRange(1, 1, 1, cabecalho.length).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  }
  return sh;
}

// Evita textos gigantes e fórmulas injetadas (=, +, -, @ no início).
function limpa_(v) {
  let s = String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, 120);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
