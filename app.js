/**
 * Uma instância do gerenciador de dados de tarefas.
 * Seu valor é definido no método `createApp()`.
 */
var manager = null;

/**
 * Uma referência à tarefa que está sendo editada, se houver. 
 * Caso contrário, o valor é `null`.
 */
var editando = null;

/**
 * Formata a data para string, no formato: data hora.
 * 
 * @param {Date} data A data que será formatada
 * @returns A data formatada como string
 */
function formatarData(data) {
  return `${data.toLocaleDateString()} ${data.toLocaleTimeString()}`;
}

/**
 * Formata a data para string no formato do input do tipo
 * datetime-local.
 * 
 * @param {Date} data A data que será formatada.
 * @returns A data formatada como string.
 */
function formatarDataParaInput(data) {
  var y = data.getYear() + 1900;
  var m = data.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = data.getDate();
  d = d < 10 ? '0' + d : d;
  var h = data.getHours();
  h = h < 10 ? '0' + h : h;
  var n = data.getMinutes();
  n = n < 10 ? '0' + n : n;
  return `${y}-${m}-${d}T${h}:${n}`;
}

/**
 * Calcula e retorna a diferença em dias entre a data1 e a data2.
 * 
 * @param {Date} data1 
 * @param {Date} data2 
 * @returns Um float que representa a diferença em dias entre as duas datas.
 */
function diferencaDatas(data1, data2) {
  var d = data1.getTime() - data2.getTime();
  var dias = d / 1000 / 60 / 60 / 24;
  return dias.toFixed(1);
}

/**
 * Formata um número que representa a diferença entre 
 * duas datas para uma string que pode conter o 
 * número de dias e de horas.
 * 
 * @param {Number} d 
 * @returns {String}
 */
function formatarDiferencaDatas(d) {
  var t = d - Math.floor(d);
  var h = (t * 24).toFixed(0);
  var r = Math.round(d);
  if (r > 0) {
    return `em ${r} dia(s) e ${h} hora(s)`;
  } else if (r == 0) {
    return `em ${h} hora(s)`;
  } else {
    return `há ${r * -1} dia(s)`;
  }
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
  manager.alternarSituacao(id);
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
 * Tratador do evento click para o botão excluir tarefa.
 */
function buttonExcluirTarefaClick() {
  var id = this.getAttribute('data-tarefas-id');
  var tarefa = manager.encontrarTarefaPorId(id);
  if (confirm(`Tem certeza que deseja excluir a tarefa "${tarefa.titulo}"?`)) {
    manager.excluir(id);
    apresentarTarefas();
  }
}

/**
 * Cria um elemento que representa o botão que permite
 * excluir a tarefa.
 * 
 * @param {*} tarefa 
 * @returns 
 */
function createButtonExcluir(tarefa) {
  var btn = document.createElement('button');
  btn.innerHTML = 'Excluir';
  btn.setAttribute('data-tarefas-id', tarefa.id);
  btn.addEventListener('click', buttonExcluirTarefaClick);
  return btn;
}

/**
 * Tratador do evento click para o botão editar tarefa.
 */
function buttonEditarTarefaClick() {
  var id = this.getAttribute('data-tarefas-id');
  editando = manager.encontrarTarefaPorId(id);
  var header = document.getElementById('form-header');
  header.innerHTML = `<strong>Editando tarefa (${editando.id})</strong>`;
  document.getElementById('titulo').value = editando.titulo;
  document.getElementById('dataDeTermino').value = formatarDataParaInput(editando.dataDeTermino);
}

/**
 * Cria um elemento representando o botão que permite editar a tarefa.
 * 
 * @param {*} tarefa 
 * @returns 
 */
function createButtonEditar(tarefa) {
  var btn = document.createElement('button');
  btn.innerHTML = 'Editar';
  if (tarefa.estahConcluida) {
    btn.setAttribute('disabled', 'disabled');
  }
  btn.setAttribute('data-tarefas-id', tarefa.id);
  btn.addEventListener('click', buttonEditarTarefaClick);
  return btn;
}

/**
 * Tratador do evento de click do botão cancelar o formulário.
 * 
 * Se o formulário estiver no modo de edição de uma tarefa,
 * então este tratador de evento altera o título do
 * formulário e define que a tarefa que está sendo
 * editada é `null`.
 */
function buttonCancelarFormClick() {
  var form = document.getElementById('form-tarefa');
  form.reset();
  if (editando != null) {
    var header = document.getElementById('form-header');
    header.innerHTML = '<strong>Cadastrar tarefa</strong>';
    editando = null;
  }
}

/**
 * Cria um elemento representando o botão que permite cancelar 
 * o cadastro ou a edição de uma tarefa.
 * 
 * @returns {Element}
 */
function createButtonCancelar() {
  var btn = document.createElement('button');
  btn.innerHTML = 'Cancelar';
  btn.setAttribute('type', 'button');
  btn.addEventListener('click', buttonCancelarFormClick);
  return btn;  
}

/**
 * Método que apresenta a lista das tarefas na forma de uma tabela.
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
  for (var tarefa of manager.tarefas.filter(tarefa => !tarefa.estahConcluida)) {
    var tr = document.createElement('tr');
    tr.setAttribute('id', `row-tarefas-${tarefa.id}`);
    if (tarefa.estahConcluida) {
      tr.style.backgroundColor = 'lightgreen';
    }
    var tdTitulo = document.createElement('td');
    if (tarefa.estahConcluida) {
      var stTitulo = document.createElement('strike');
      stTitulo.innerHTML = tarefa.titulo;
      tdTitulo.appendChild(stTitulo);
    } else {
      tdTitulo.innerHTML = tarefa.titulo;
    }
    var tdTermino = document.createElement('td');
    var data = formatarData(tarefa.dataDeTermino);
    var diff = diferencaDatas(tarefa.dataDeTermino, new Date());
    tdTermino.innerHTML = `<center>
    ${data}<br>
    <small>${formatarDiferencaDatas(diff)}</small>
    </center>`;
    var tdConcluir = document.createElement('td');
    btnConcluir = createButtonConcluir(tarefa);
    btnExcluir = createButtonExcluir(tarefa);
    btnEditar = createButtonEditar(tarefa);
    tdConcluir.appendChild(btnConcluir);
    tdConcluir.appendChild(btnExcluir);
    tdConcluir.appendChild(btnEditar);

    tr.appendChild(tdTitulo);
    tr.appendChild(tdTermino);
    tr.appendChild(tdConcluir);
    tbody.appendChild(tr);
  }

  table = document.getElementById('tableTarefasConcluidas');
  tbody = document.getElementById('tbodyTarefasConcluidas');
  if (tbody) {
    tbody.remove();
  }
  tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'tbodyTarefasConcluidas');
  table.appendChild(tbody);
  for (var tarefa of manager.tarefas.filter(tarefa => tarefa.estahConcluida)) {
    var tr = document.createElement('tr');
    tr.setAttribute('id', `row-tarefas-${tarefa.id}`);
    if (tarefa.estahConcluida) {
      tr.style.backgroundColor = 'lightgreen';
    }
    var tdTitulo = document.createElement('td');
    tdTitulo.innerHTML = tarefa.titulo;

    var tdTermino = document.createElement('td');
    var data = formatarData(tarefa.dataDeTermino);
    var diff = diferencaDatas(tarefa.dataDeTermino, new Date());
    tdTermino.innerHTML = `<center>
    ${data}<br>
    <small>${formatarDiferencaDatas(diff)}</small>
    </center>`;
    var tdConcluir = document.createElement('td');
    btnConcluir = createButtonConcluir(tarefa);
    btnExcluir = createButtonExcluir(tarefa);
    
    tdConcluir.appendChild(btnConcluir);
    tdConcluir.appendChild(btnExcluir);
    
    tr.appendChild(tdTitulo);
    tr.appendChild(tdTermino);
    tr.appendChild(tdConcluir);
    tbody.appendChild(tr);
  }  
}

/**
 * O tratador do evento submit do formulário.
 * 
 * @param {*} e 
 */
function formSubmit(e) {
  e.preventDefault();
  var inputTitulo = document.getElementById('titulo');
  var inputData = document.getElementById('dataDeTermino');
  var titulo = inputTitulo.value;
  var data = inputData.value;
  if (titulo == '' || data == '') {
    alert('É necessário informar os dados da tarefa');
  } else {
    if (editando == null) {
      manager.cadastrar(titulo, new Date(data));
    } else {
      manager.editar(editando.id, titulo, new Date(data), editando.estahConcluida);
      editando = null;
    }
    this.reset();
    apresentarTarefas();
  }
}

/**
 * Cria a estrutura do formulário, contendo:
 * 
 * * campo de título
 * * campo para data e hora de término
 * 
 * @returns {Element} O elemento que representa o formulário.
 */
function createForm() {
  var form = document.createElement('form');
  form.setAttribute('id', 'form-tarefa');
  form.addEventListener('submit', formSubmit);

  form.appendChild(document.createElement('hr'));

  var header = document.createElement('div');
  header.setAttribute('id', 'form-header');
  header.innerHTML = '<strong>Cadastrar tarefa</strong>';
  form.appendChild(header);

  form.appendChild(document.createElement('br'));

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

  var divData = document.createElement('div');
  var inputData = document.createElement('input');
  inputData.setAttribute('id', 'dataDeTermino');
  inputData.setAttribute('name', 'dataDeTermino');
  inputData.setAttribute('type', 'datetime-local');
  inputData.setAttribute('required', 'required');
  divData.appendChild(inputData);
  var divMensagemData = document.createElement('div');
  divMensagemData.innerHTML = `
         <strong style="color:red">
           A data é de preenchimento obrigatório
         </strong>
         `;
  divData.appendChild(divMensagemData);
  form.appendChild(divData);
  form.appendChild(document.createElement('br'));

  var divButtons = document.createElement('div');
  var buttonOk = document.createElement('button');
  buttonOk.innerText = 'Salvar';
  buttonOk.setAttribute('type', 'submit');
  divButtons.appendChild(buttonOk);
  divButtons.appendChild(document.createTextNode(' '));
  var buttonCancelar = createButtonCancelar();
  divButtons.appendChild(buttonCancelar);

  form.appendChild(divButtons);

  return form;
}

/**
 * Cria a estrutura da tabela, contendo um cabeçalho com
 * as colunas:
 * 
 * * tarefa (título)
 * * data de término
 * * ações (para os botões de ação concluir, excluir e editar tarefa)
 * @returns {Element}
 */
function createTableTarefasCadastradas() {
  var container = document.createElement('div');

  var header = document.createElement('div');
  header.innerHTML = '<strong>Tarefas cadastradas</strong>';
  container.appendChild(header);
  container.appendChild(document.createElement('br'));

  var tableTarefas = document.createElement('table');
  tableTarefas.setAttribute('id', 'tableTarefas');
  tableTarefas.setAttribute('border', 1);
  tableTarefas.setAttribute('width', '100%');
  container.appendChild(tableTarefas);

  var thead = document.createElement('thead');

  var tr = document.createElement('tr');

  var thTitulo = document.createElement('th');
  thTitulo.setAttribute('width', '45%')
  thTitulo.innerHTML = 'Tarefa';
  tr.appendChild(thTitulo);

  var thDataDeTermino = document.createElement('th');
  thDataDeTermino.innerHTML = 'Data de término';
  thDataDeTermino.setAttribute('width', '20%')
  tr.appendChild(thDataDeTermino);

  var thAcoes = document.createElement('th');
  thAcoes.innerHTML = 'Ações';
  thAcoes.setAttribute('width', '35%')
  tr.appendChild(thAcoes);

  thead.appendChild(tr);
  tableTarefas.appendChild(thead);

  var tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'tbodyTarefas');
  tableTarefas.appendChild(tbody);

  return container;
}

function createTableTarefasConcluidas() {
  var container = document.createElement('div');

  var header = document.createElement('div');
  header.innerHTML = '<strong>Tarefas concluídas</strong>';
  container.appendChild(header);
  container.appendChild(document.createElement('br'));

  var tableTarefas = document.createElement('table');
  tableTarefas.setAttribute('id', 'tableTarefasConcluidas');
  tableTarefas.setAttribute('border', 1);
  tableTarefas.setAttribute('width', '100%');
  container.appendChild(tableTarefas);

  var thead = document.createElement('thead');

  var tr = document.createElement('tr');

  var thTitulo = document.createElement('th');
  thTitulo.setAttribute('width', '45%')
  thTitulo.innerHTML = 'Tarefa';
  tr.appendChild(thTitulo);

  var thDataDeTermino = document.createElement('th');
  thDataDeTermino.innerHTML = 'Data de término';
  thDataDeTermino.setAttribute('width', '20%')
  tr.appendChild(thDataDeTermino);

  var thAcoes = document.createElement('th');
  thAcoes.innerHTML = 'Ações';
  thAcoes.setAttribute('width', '35%')
  tr.appendChild(thAcoes);

  thead.appendChild(tr);
  tableTarefas.appendChild(thead);

  var tbody = document.createElement('tbody');
  tbody.setAttribute('id', 'tbodyTarefasConcluidas');
  tableTarefas.appendChild(tbody);

  return container;
}

/**
 * Método que cria a interface do app.
 */
function createApp() {
  manager = new TarefaManager();
  var app = document.getElementById('app');

  var hTitle = document.createElement('h1');
  hTitle.innerHTML = 'Gerenciador de tarefas';
  app.appendChild(hTitle);

  var hSubtitle = document.createElement('h4');
  hSubtitle.innerHTML = 'Demonstração de recursos de manipulação do DOM com JavaScript';
  app.appendChild(hSubtitle);

  form = createForm();
  app.appendChild(form);

  app.appendChild(document.createElement('hr'));
  app.appendChild(document.createElement('br'));

  var tableTarefas = createTableTarefasCadastradas();
  app.appendChild(tableTarefas);

  app.appendChild(document.createElement('br')); 

  var tableTarefasConcluidas = createTableTarefasConcluidas();
  app.appendChild(tableTarefasConcluidas);
}

/**
 * Tratador do evento DOMContentLoaded para o document.
 */
function documentLoad() {
  createApp();
  apresentarTarefas();
}

/**
 * Define o tratador do evento DOMContentLoaded do document.
 */
document.addEventListener('DOMContentLoaded', documentLoad);
