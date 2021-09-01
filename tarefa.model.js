/**
 * Classe que representa as informações de uma tarefa, contendo:
 * - id (identificador)
 * - titulo
 * - data de término
 * - indicação de tarefa concluída
 */
class Tarefa {
  /**
   * Construtor da classe.
   */
  constructor(id, titulo, dataDeTermino, estahConcluida) {
    this.id = id;
    this.titulo = titulo;
    this.dataDeTermino = dataDeTermino;
    this.estahConcluida = estahConcluida;
  }

  static fromLocalStorage(tarefa) {
    var nova = new Tarefa(tarefa.id, tarefa.titulo, tarefa.dataDeTermino, tarefa.estahConcluida);
    nova.dataDeTermino = new Date(tarefa.dataDeTermino);
    return nova;
  }

  /**
   * Método que alterna o valor do atributo `estahConcluida`.
   */
  alternarSituacao() {
    this.estahConcluida = !this.estahConcluida;
  }
}
