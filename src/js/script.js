"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Cursos {
    constructor() {
        this.allCursos = [];
        this.container = document.getElementById("planosGrid");
        this.searchInput = document.getElementById("filterInput");
        if (this.container && this.searchInput) {
            this.init();
        }
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("./cursos.json");
                if (!response.ok)
                    throw new Error("Erro ao carregar dados");
                this.allCursos = yield response.json();
                this.render(this.allCursos);
                this.setupFilter();
            }
            catch (error) {
                if (this.container) {
                    this.container.innerHTML = `<p>Erro ao carregar os planos.</p>`;
                }
            }
        });
    }
    setupFilter() {
        var _a;
        (_a = this.searchInput) === null || _a === void 0 ? void 0 : _a.addEventListener("input", () => {
            var _a;
            const query = ((_a = this.searchInput) === null || _a === void 0 ? void 0 : _a.value.toLowerCase()) || "";
            const filtered = this.allCursos.filter((p) => p.assunto.toLowerCase().includes(query) ||
                p.nomeCurso.toLowerCase().includes(query));
            this.render(filtered);
        });
    }
    render(planos) {
        if (!this.container)
            return;
        // Se a busca não encontrar nada, exibe mensagem amigável
        if (planos.length === 0) {
            this.container.innerHTML = `<p class="empty-msg">Nenhum plano encontrado.</p>`;
            return;
        }
        // Transforma cada objeto de plano em um bloco de HTML (Card)
        this.container.innerHTML = planos
            .map((p) => `
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
        `)
            .join(""); // O .join('') evita que apareçam vírgulas entre os cards
    }
}
class MenuNavigation {
    constructor() {
        // Busca o botão no HTML pelo ID e força o tipo (casting) para Button
        this.btn = document.getElementById("btnMenu");
        // Busca o elemento do menu pelo ID
        this.menu = document.getElementById("menuLinks");
        // Verificação de segurança: só prossegue se ambos os elementos existirem na página
        if (this.btn && this.menu) {
            // Chama o método que vai "escutar" as interações do usuário
            this.bindEvents();
        }
    }
    bindEvents() {
        var _a, _b;
        // Abre/fecha ao clicar no botão
        (_a = this.btn) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.toggleMenu());
        // Se clicar em um link (âncora) dentro do menu, ele fecha sozinho
        (_b = this.menu) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
            const target = e.target;
            if (target.tagName === "A") {
                this.closeMenu();
            }
        });
    }
    toggleMenu() {
        console.log("MenuNavigation carregado com sucesso");
        // Validação de segurança: se o menu ou botão sumirem do DOM, interrompe a função
        if (!this.menu || !this.btn)
            return;
        // Alterna a classe 'active' no menu: se tiver, remove; se não tiver, adiciona
        // A variável 'isOpen' recebe true se a classe foi adicionada, ou false se removida
        const isOpen = this.menu.classList.toggle("active");
        // Alterna a classe 'open' no botão (usada para animar o ícone do hambúrguer para o X)
        this.btn.classList.toggle("open");
        // Atualiza o atributo ARIA para que cegos ou pessoas com baixa visão saibam
        // via leitor de tela se o conteúdo do menu está expandido (true) ou recolhido (false)
        this.btn.setAttribute("aria-expanded", isOpen.toString());
    }
    closeMenu() {
        var _a, _b;
        // O uso do '?' (Optional Chaining) tenta remover a classe 'active' apenas se 'this.menu' existir
        (_a = this.menu) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
        // Remove a classe 'open' do botão, forçando o ícone a voltar ao estado de hambúrguer
        (_b = this.btn) === null || _b === void 0 ? void 0 : _b.classList.remove("open");
    }
}
window.addEventListener("DOMContentLoaded", () => {
    new MenuNavigation();
    new Cursos();
});
