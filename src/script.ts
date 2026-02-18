interface CursosOferecidos {
  id: number; 
  nivel: string; 
  nomeCurso: string; 
  assunto: string; 
  descricao: string; 
}

class Cursos {
  private container: HTMLElement | null; 
  private searchInput: HTMLInputElement | null; 
  private allCursos: CursosOferecidos[] = []; 

  constructor() {
    this.container = document.getElementById("planosGrid");
    this.searchInput = document.getElementById(
      "filterInput",
    ) as HTMLInputElement;

    if (this.container && this.searchInput) {
      this.init();
    }
  }
  
  private async init(): Promise<void> {
    try {

      const response = await fetch("./cursos.json");
      if (!response.ok) throw new Error("Erro ao carregar dados");

      this.allCursos = await response.json();
      this.render(this.allCursos); 
      this.setupFilter(); 
    } catch (error) {
      if (this.container) {
        this.container.innerHTML = `<p>Erro ao carregar os planos.</p>`;
      }
    }
  }

  private setupFilter(): void {
   
    this.searchInput?.addEventListener("input", () => {
     
      const query = this.searchInput?.value.toLowerCase() || "";
      
      const filtered = this.allCursos.filter(
        (p) =>
          p.assunto.toLowerCase().includes(query) ||
          p.nomeCurso.toLowerCase().includes(query) 

      );
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
                <small><p><strong>${p.assunto}:</strong> ${p.descricao}</small></p>
                </div>
                <button class="btn-primary">Saber mais</button>
            </article>
        `,
      )
      .join(""); // O .join('') evita que apareçam vírgulas entre os cards
  }
}
class MenuNavigation {
  
  private btn: HTMLButtonElement | null;
  private menu: HTMLElement | null;

  constructor() {
    
    this.btn = document.getElementById("btnMenu") as HTMLButtonElement;
    this.menu = document.getElementById("menuLinks");
    
    if (this.btn && this.menu) {
      this.bindEvents();
    }
  }

  private bindEvents(): void {
    
    this.btn?.addEventListener("click", () => this.toggleMenu());
    this.menu?.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        this.closeMenu();
      }
    });
  }

  private toggleMenu(): void {
    console.log("MenuNavigation carregado com sucesso");
    
    if (!this.menu || !this.btn) return;
    
    const isOpen = this.menu.classList.toggle("active");
   
    this.btn.classList.toggle("open");
    this.btn.setAttribute("aria-expanded", isOpen.toString());
  }

  private closeMenu(): void {
   
    this.menu?.classList.remove("active");
    this.btn?.classList.remove("open");
  }
}


window.addEventListener("DOMContentLoaded", () => {
  new MenuNavigation(); 
  new Cursos(); 
});
