/**
 * Classe manager responsável por gerenciar os dados
 * de tarefas. 
 * 
 * Utiliza o LocalStorage para armazenamento dos dados.
 */
class TarefaManager {

  /**
   * Construtor da classe. 
   * 
   * Define o array de tarefas e executa as tarefas:
   * 
   * * configuração do local storage
   * * carregar dados do local storage para o array de tarefas
   */
  constructor() {
    this.tarefas = [];
    this.configurarLocalStorage();
    this.carregarDados();
  }

  /**
   * Configura o local storage.
   * 
   * Se o item 'tarefas' não existir no local storage,
   * então define seu valor como um array vazio
   * (representado string JSON).
   */
  configurarLocalStorage() {
    if (localStorage.getItem('tarefas') == null) {
      localStorage.setItem('tarefas', JSON.stringify([]));
    }
  }

  /**
   * Carrega dados do local storage para o array de 
   * tarefas.
   */
  carregarDados() {
    var dados = localStorage.getItem('tarefas');
    this.tarefas = JSON.parse(dados) || [];
    this.tarefas = this.tarefas.map(tarefa => Tarefa.fromLocalStorage(tarefa));
  }

  /**
   * Salva os dados do array de tarefas para o local storage.
   * 
   * Utiliza uma representação do array em JSON.
   */
  salvarDados() {
    localStorage.setItem('tarefas', JSON.stringify(this.tarefas));
  }

  /**
   * Cadastra a tarefa no array de tarefas e atualiza
   * o local storage.
   * 
   * @param {String} titulo 
   * @param {Date} dataDeTermino 
   */
  cadastrar(titulo, dataDeTermino) {
    var tarefa = new Tarefa(new Date().getTime(), titulo, dataDeTermino, false);
    this.tarefas.push(tarefa);
    this.salvarDados();
  }

  /**
   * Altera os atributos da tarefa indicada pelo 
   * parâmetro `id` e atualiza o local storage.
   * 
   * @param {Number} id 
   * @param {String} titulo 
   * @param {Date} dataDeTermino 
   * @param {Boolean} estahConcluida 
   */
  editar(id, titulo, dataDeTermino, estahConcluida) {
    var tarefa = this.encontrarTarefaPorId(id);
    tarefa.titulo = titulo;
    tarefa.dataDeTermino = dataDeTermino;
    tarefa.estahConcluida = estahConcluida;
    this.salvarDados();
  }

  /**
   * Econtra e retorna uma tarefa com base no seu id.
   * 
   * @param {Number} id 
   * @returns 
   */
  encontrarTarefaPorId(id) {
    return this.tarefas.find(t => t.id == id);
  }

  /**
   * Exclui uma tarefa com base no seu id. Atualiza 
   * o local storage.
   * 
   * @param {Number} id 
   */
  excluir(id) {
    var tarefa = this.encontrarTarefaPorId(id);
    var i = this.tarefas.indexOf(tarefa);
    this.tarefas.splice(i, 1);
    this.salvarDados();
  }

  /**
   * Alterna a situação da tarefa (se está ou não concluída) e
   * atualiza o local storage.
   * 
   * @param {Number} id 
   */
  alternarSituacao(id) {
    var tarefa = this.encontrarTarefaPorId(id);
    tarefa.alternarSituacao();
    this.salvarDados();
  }
}
