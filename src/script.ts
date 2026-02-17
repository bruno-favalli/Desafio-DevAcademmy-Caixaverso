/**
 * Interface que espelha o nosso JSON.
 * Garante que não tentaremos acessar propriedades inexistentes.
 */

interface CursosOferecidos {
  id: number; // Identificador único do plano
  nivel: string; // Ex: "Imóvel", "Automóvel"
  nomeCurso: string; // Valor total da carta de crédito
  assunto: string; // Valor mensal
  descricao: string; // Quantidade de meses
}

class Cursos {
  private container: HTMLElement | null; // Onde os cards serão inseridos
  private searchInput: HTMLInputElement | null; // O campo de busca
  private allCursos: CursosOferecidos[] = []; // Cache local de todos os planos

  constructor() {
    // Tenta localizar no HTML o elemento onde os cards serão exibidos (o grid)
    this.container = document.getElementById("planosGrid");

    // Tenta localizar o campo de entrada de texto usado para o filtro
    // O "as HTMLInputElement" avisa ao TypeScript que este elemento terá a propriedade '.value'
    this.searchInput = document.getElementById(
      "filterInput",
    ) as HTMLInputElement;

    //Verificação de segurança essencial
    // O código dentro do 'if' só será executado se ambos os elementos acima forem encontrados
    if (this.container && this.searchInput) {
      // Inicia o processo de busca de dados (fetch) e configuração do sistema
      this.init();
    }
  }
  // Promessa
  private async init(): Promise<void> {
    try {
      // Busca o arquivo JSON de forma assíncrona
      const response = await fetch("./cursos.json");
      if (!response.ok) throw new Error("Erro ao carregar dados");

      // Converte a resposta bruta em um objeto JS/TS
      this.allCursos = await response.json();
      this.render(this.allCursos); // Desenha os cards iniciais
      this.setupFilter(); // Ativa o campo de busca
    } catch (error) {
      // Caso o arquivo falte ou o servidor caia, avisa o usuário
      if (this.container) {
        this.container.innerHTML = `<p>Erro ao carregar os planos.</p>`;
      }
    }
  }

  private setupFilter(): void {
    // Adiciona um ouvinte ao input de busca que dispara toda vez que o usuário digita algo
    this.searchInput?.addEventListener("input", () => {
      // Captura o valor digitado, transforma em minúsculas para a busca não ser sensível ao caso (Case Insensitive)
      // Se o valor for nulo, define uma string vazia como padrão
      const query = this.searchInput?.value.toLowerCase() || "";
      // Cria um novo array apenas com os planos que atendem aos critérios de busca
      const filtered = this.allCursos.filter(
        (p) =>
          // Critério 1: O tipo do consórcio (ex: "carro") contém o que foi digitado?
          p.nivel.toLowerCase().includes(query) ||
          // Critério 2: O valor do crédito (convertido para texto) contém os números digitados?
          p.assunto.toString().includes(query),
      );
      // Chama o método de renderização passando apenas a lista filtrada para atualizar a tela
      this.render(filtered);
    });
  }
  private render(planos: CursosOferecidos[]): void {
    if (!this.container) return;

    // Se a busca não encontrar nada, exibe mensagem amigável
    if (planos.length === 0) {
      this.container.innerHTML = `<p class="empty-msg">Nenhum plano encontrado.</p>`;
      return;
    }

    // Transforma cada objeto de plano em um bloco de HTML (Card)
    this.container.innerHTML = planos
      .map(
        (p) => `
            <article class="plan-card">
                <div class="card-header">
                    <span class="label">${p.nivel}</span>
                    <h3>${p.nomeCurso}</h3>
                </div>
                <div class="card-body">
                <small><p><strong>${p.assunto}</strong> ${p.descricao}</small></p>
                </div>
                <button class="btn-primary">Saber mais</button>
            </article>
        `,
      )
      .join(""); // O .join('') evita que apareçam vírgulas entre os cards
  }
}
class MenuNavigation {
  // Declara a propriedade para o botão, podendo ser o elemento HTML ou nulo
  private btn: HTMLButtonElement | null;
  // Declara a propriedade para o menu (lista de links), podendo ser o elemento ou nulo
  private menu: HTMLElement | null;

  constructor() {
    // Busca o botão no HTML pelo ID e força o tipo (casting) para Button
    this.btn = document.getElementById("btnMenu") as HTMLButtonElement;
    // Busca o elemento do menu pelo ID
    this.menu = document.getElementById("menuLinks");
    // Verificação de segurança: só prossegue se ambos os elementos existirem na página
    if (this.btn && this.menu) {
      // Chama o método que vai "escutar" as interações do usuário
      this.bindEvents();
    }
  }

  private bindEvents(): void {
    // Abre/fecha ao clicar no botão
    this.btn?.addEventListener("click", () => this.toggleMenu());

    // Se clicar em um link (âncora) dentro do menu, ele fecha sozinho
    this.menu?.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        this.closeMenu();
      }
    });
  }

  private toggleMenu(): void {
    console.log("MenuNavigation carregado com sucesso");
    // Validação de segurança: se o menu ou botão sumirem do DOM, interrompe a função
    if (!this.menu || !this.btn) return;
    // Alterna a classe 'active' no menu: se tiver, remove; se não tiver, adiciona
    // A variável 'isOpen' recebe true se a classe foi adicionada, ou false se removida
    const isOpen = this.menu.classList.toggle("active");
    // Alterna a classe 'open' no botão (usada para animar o ícone do hambúrguer para o X)
    this.btn.classList.toggle("open");
    // Atualiza o atributo ARIA para que cegos ou pessoas com baixa visão saibam
    // via leitor de tela se o conteúdo do menu está expandido (true) ou recolhido (false)
    this.btn.setAttribute("aria-expanded", isOpen.toString());
  }

  private closeMenu(): void {
    // O uso do '?' (Optional Chaining) tenta remover a classe 'active' apenas se 'this.menu' existir
    this.menu?.classList.remove("active");
    // Remove a classe 'open' do botão, forçando o ícone a voltar ao estado de hambúrguer
    this.btn?.classList.remove("open");
  }
}

// Inicialização segura
window.addEventListener("DOMContentLoaded", () => {
  new MenuNavigation(); // Instancia o menu
  new Cursos(); // Instancia o buscador de planos
});
