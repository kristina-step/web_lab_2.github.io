class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.currentSearch = '';
        this.init();
    }

    init() {
        this.createAppStructure();
        this.applyHalloweenStyles(); 
        this.renderTasks();
        this.bindEvents();
        this.addHalloweenEffects(); 
    }

    createAppStructure() {
        const app = document.getElementById('app') || this.createElement('div', {id: 'app'});
        document.body.appendChild(app);

        const container = this.createElement('div', {className: 'container'});
        
        const header = this.createElement('div', {className: 'header'});
        const h1 = this.createElement('h1', {textContent: '🎃 Хэллуин ToDo 👻'});
        const p = this.createElement('p', {textContent: 'Управляйте своими жуткими задачами!'});
        header.appendChild(h1);
        header.appendChild(p);
