/**
 * Um vetor com a lista das tarefas.
 */
var tarefas = [];

/**
 * Método que cria uma instância de `Tarefa` com base nos parâmetros e 
 * adiciona no vetor `tarefas`. Este método não atualiza a interface
 * do aplicativo.
 */
function salvarTarefa(titulo, dataDeTermino, estahConcluida) {
  var id = tarefas.length + 1;
  tarefas.push(new Tarefa(id, titulo, dataDeTermino, estahConcluida));
}

/**
 * Tratador do evento de click do botão que
 * marca uma tarefa como concluída ou desmarca como concluída
 * de acordo com a situação da tarefa relacionada.
 * 
 * O código opera da seguinte forma:
 * - obtém o valor do atributo `data-tarefas-id` do botão
 * - encontra a tarefa correspondente na lista de tarefas
 * - alterna o valor do atributo `estahConcluida`
 * - chama o método `apresentarTarefas()` para atualizar a lista das tarefas
 */
function buttonConcluirTarefaClick() {
  var id = this.getAttribute('data-tarefas-id');
  var tarefa = tarefas.find(t => t.id == id);
  tarefa.alternarSituacao();
  apresentarTarefas();
}

/**
 * Método que cria o botão de marcar a tarefa como concluída ou desfazer
 * desfazer a conclusão, de acordo com a situação da tarefa
 * informada como parâmetro `tarefa`.
 * 
 * O código opera da seguinte forma:
 * - cria um elemento `button`
 * - define o valor do atributo `innerHTML` de acordo com a situação da tarefa
 * - define o valor do atributo `data-tarefas-id` do botão como o valor do atributo `id` da `tarefa`
 * - adiciona o tratador do evento de click no botão (`buttonConcluirTarefaClick`)
 * - retorna elemento `button`.
 */
function createButtonConcluir(tarefa) {
  var btnConcluir = document.createElement('button');
  if (tarefa.estahConcluida) {
    btnConcluir.innerHTML = 'Desfazer concluir';
  } else {
    btnConcluir.innerHTML = 'Concluir';
  }
  btnConcluir.setAttribute('data-tarefas-id', tarefa.id);
  btnConcluir.addEventListener('click', buttonConcluirTarefaClick);
  return btnConcluir;
}

/**
 * Método que apresenta a lista das tarefas na forma de uma tabela.
 * 
 * O código opera da seguinte forma:
 * - obtém o elemento table com id `tableTarefas`
 * - obtém o elemento tbody com id `tbodyTarefas`
 * - se o tbody existir, remove-o do DOM para que a tabela inicie vazia
 * - cria o elemento tbody com id `tbodyTarefas`
 * - insere o tbody nos filhos do table
 * - para cada tarefa da lista:
 *  - cria um elemento tr para a linha da tarefa
 *  - se a tarefa estiver concluída, altera o valor da propriedade `backgroundColor` do estilo um tom de verde claro
 *  - cria um elemento td para o id da tarefa
 *  - altera o valor do atributo `innerHTML` para o valor do atributo `id` da tarefa
 *  - cria um elemento td para o título da tarefa
 *  - se a tarefa estivar concluída, apresenta o título tachado (com a utilização do elemento strike)
 *  - define o valor do atributo `innerHTML` do td para o valor do atributo `titulo` da tarefa
 *  - cria um elemento td para a data de conclusão (término) da tarefa
 *  - define o valor do atributo `innerHTML` do td para o valor do atributo `dataDeTermino` da tarefa
 *  - cria um elemento td para o botão de concluir ou desmarcar como concluída
 *  - adiciona o td do id no tr da linha da tarefa e faz o mesmo com os demais elementos td
 *  - adiciona o tr da linha da tarefa no elemento tbody
 */
function apresentarTarefas() {
  var table = document.getElementById('tableTarefas');
  var tbody = document.getElementById('tbodyTarefas');
  if (tbody) {
    tbody.remove();
  }
  tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'tbodyTarefas');
  table.appendChild(tbody);
  for (var tarefa of tarefas) {
    var tr = document.createElement('tr');
    tr.setAttribute('id', `rowTarefas-${tarefa.id}`);
    if (tarefa.estahConcluida) {
      tr.style.backgroundColor = 'lightgreen';
    }
    var tdId = document.createElement('td');
    tdId.innerHTML = tarefa.id;
    var tdTitulo = document.createElement('td');
    if (tarefa.estahConcluida) {
      var stTitulo = document.createElement('strike');
      stTitulo.innerHTML = tarefa.titulo;
      tdTitulo.appendChild(stTitulo);
    } else {
      tdTitulo.innerHTML = tarefa.titulo;
    }
    var tdTermino = document.createElement('td');
    tdTermino.innerHTML = tarefa.dataDeTermino;
    var tdConcluir = document.createElement('td');
    btnConcluir = createButtonConcluir(tarefa);
    tdConcluir.appendChild(btnConcluir);
    tr.appendChild(tdId);
    tr.appendChild(tdTitulo);
    tr.appendChild(tdTermino);
    tr.appendChild(tdConcluir);
    tbody.appendChild(tr);
  }
}

/**
 * Referência para o objeto window do formulário de cadastrar tarefa.
 */
var windowCadastrarTarefa;

/**
 * Método que cria a janela com o formulário de cadastrar tarefa.
 * 
 * O código opera da seguinte forma:
 * - abre a janela
 * - se o documento da janela tiver filhos, remove o primeiro (para deixar o documento vazio)
 * - cria um elemento form
 * - adiciona um tratador para o evento `submit` do form, que obém o valor do campo input e o utiliza para criar um novo objeto (tarefa) na lista das tarefas. Depois, atualiza a lista das tarefas na outra janela.
 * - cria um elemento h1 com o título da página
 * - cria um elemento div para conter o campo título
 * - cria um elemento input para o campo título
 * - cria um elemento div para conter uma mensagem de aviso de validação
 * - cria um elemento button para acionar o evento submit do form (salvar)
 * - adiciona os elementos no DOM do documento da janela
 */
function createCadastrarTarefaWindow() {
  windowCadastrarTarefa = window.open('', 'windowCadastrarTarefa', 'location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0,height=300,width=300');

  if (windowCadastrarTarefa.document.body.childNodes.length > 0) {
    windowCadastrarTarefa.document.body.removeChild(windowCadastrarTarefa.document.body.childNodes[0]);
  }

  var form = document.createElement('form');
  form.addEventListener('submit', function () {
    var input = windowCadastrarTarefa.document.getElementById('titulo');
    var titulo = input.value;
    if (titulo == '') {
      input.focus();
    } else {
      windowCadastrarTarefa.opener.salvarTarefa(titulo, new Date(2021, 7, 14), false);
      windowCadastrarTarefa.opener.apresentarTarefas();
      windowCadastrarTarefa.close();
    }
  });

  var h1Header = document.createElement('h1');
  h1Header.innerText = 'Cadastrar tarefa';
  form.appendChild(h1Header);

  form.appendChild(document.createElement('hr'));

  var divTitulo = document.createElement('div');
  var inputTitulo = document.createElement('input');
  inputTitulo.setAttribute('id', 'titulo');
  inputTitulo.setAttribute('name', 'titulo');
  inputTitulo.setAttribute('type', 'text');
  inputTitulo.setAttribute('placeholder', 'Título da tarefa');
  inputTitulo.setAttribute('required', 'required');
  divTitulo.appendChild(inputTitulo);
  var divMensagem = document.createElement('div');
  divMensagem.innerHTML = `
         <strong style="color:red">
           O título é de preenchimento obrigatório
         </strong>
         `;
  divTitulo.appendChild(divMensagem);
  form.appendChild(divTitulo);

  form.appendChild(document.createElement('hr'));

  var divButtonOk = document.createElement('div');
  var buttonOk = document.createElement('button');
  buttonOk.innerText = 'Salvar';
  buttonOk.setAttribute('type', 'submit');
  form.appendChild(buttonOk);

  windowCadastrarTarefa.document.body.appendChild(form);
  inputTitulo.focus();
}

/**
 * Tratador do evento click do botão 'Cadastrar tarefa'.
 */
function buttonCadastrarTarefaClick() {
  createCadastrarTarefaWindow();
}

/**
 * Método que cria a interface do app.
 */
function createApp() {
  var app = document.getElementById('app');

  var hTitle = document.createElement('h1');
  hTitle.innerHTML = 'Gerenciador de tarefas';
  app.appendChild(hTitle);

  var hSubtitle = document.createElement('h4');
  hSubtitle.innerHTML = 'Demonstração de recursos de manipulação do DOM com JavaScript';
  app.appendChild(hSubtitle);

  var buttonCadastrarTarefa = document.createElement('button');
  buttonCadastrarTarefa.innerText = 'Cadastrar tarefa';
  buttonCadastrarTarefa.addEventListener('click', buttonCadastrarTarefaClick);
  app.appendChild(buttonCadastrarTarefa);

  app.appendChild(document.createElement('hr'));

  var tableTarefas = document.createElement('table');
  tableTarefas.setAttribute('id', 'tableTarefas');
  tableTarefas.setAttribute('border', 1);

  var thead = document.createElement('thead');

  var tr = document.createElement('tr');

  var thId = document.createElement('th');
  thId.innerHTML = 'Id';
  tr.appendChild(thId);

  var thTitulo = document.createElement('th');
  thTitulo.innerHTML = 'Tarefa';
  tr.appendChild(thTitulo);

  var thDataDeTermino = document.createElement('th');
  thDataDeTermino.innerHTML = 'Data de término';
  tr.appendChild(thDataDeTermino);

  var thConcluir = document.createElement('th');
  thConcluir.innerHTML = 'Concluir';
  tr.appendChild(thConcluir);

  thead.appendChild(tr);
  tableTarefas.appendChild(thead);

  var tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'tbodyTarefas');
  tableTarefas.appendChild(tbody);

  app.appendChild(tableTarefas);
}

/**
 * Tratador do evento DOMContentLoaded para o document.
 */
function documentLoad() {
  salvarTarefa("Tomar água", new Date(2021, 7, 14), false);
  salvarTarefa("Escrever introdução do TCC", new Date(2021, 7, 20), false);
  salvarTarefa("Concluir tarefa de IDW", new Date(2021, 7, 30), false);
  createApp();
  apresentarTarefas();
}

/**
 * Define o tratador do evento DOMContentLoaded do document.
 */
document.addEventListener('DOMContentLoaded', documentLoad);
