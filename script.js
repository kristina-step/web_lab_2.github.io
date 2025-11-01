class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.currentSearch = '';
        this.isMobile = this.checkMobile();
        this.init();
    }

    init() {
        this.createAppStructure();
        this.applyHalloweenStyles();
        this.renderTasks();
        this.bindEvents();
        this.addHalloweenEffects();
        this.setupResponsive();
    }

    setupCategories() {
        this.categories = [
            { id: 'personal', name: 'Личные', color: '#ff6b00' },
            { id: 'work', name: 'Работа', color: '#4facfe' },
            { id: 'shopping', name: 'Покупки', color: '#28a745' },
            { id: 'health', name: 'Здоровье', color: '#dc3545' },
            { id: 'other', name: 'Другое', color: '#6c757d' }
        ];
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const active = total - completed;
        
        const statsText = document.getElementById('statsText');
        if (statsText) {
            statsText.textContent = `${active}/${total}`;
            statsText.title = `Активных: ${active}, Выполненных: ${completed}`;
        }
    }

    checkMobile() {
        return window.innerWidth <= 768;
    }

    setupResponsive() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = this.checkMobile();
            
            if (wasMobile !== this.isMobile) {
                this.renderTasks();
            }
        });
    }

    createAppStructure() {
        const app = document.getElementById('app') || this.createElement('div', {id: 'app'});
        document.body.appendChild(app);

        const container = this.createElement('div', {className: 'container'});
        
        const header = this.createElement('div', {className: 'header'});
        const h1 = this.createElement('h1', {textContent: this.isMobile ? '🎃 ToDo 👻' : '🎃 Хэллуин ToDo 👻'});
        const p = this.createElement('p', {textContent: this.isMobile ? 'Жуткие задачи' : 'Управляйте своими жуткими задачами!'});
        header.appendChild(h1);
        header.appendChild(p);

        const todoForm = this.createElement('div', {className: 'todo-form'});
        const formGroup = this.createElement('div', {className: 'form-group'});
        
        const taskInput = this.createElement('input', {
            type: 'text',
            className: 'form-input',
            placeholder: this.isMobile ? 'Новая задача...' : 'Добавьте жуткую задачу...',
            id: 'taskInput'
        });
        
        const dateInput = this.createElement('input', {
            type: 'date',
            className: 'form-input',
            id: 'dateInput'
        });
        
        const addButton = this.createElement('button', {
            className: 'btn btn-primary',
            textContent: this.isMobile ? '🎃 Добавить' : '🎃 Добавить задачу'
        });
        
        formGroup.appendChild(taskInput);
        formGroup.appendChild(dateInput);
        formGroup.appendChild(addButton);
        todoForm.appendChild(formGroup);

        const controls = this.createElement('div', {className: 'controls'});
        
        const filterGroup = this.createElement('div', {className: 'control-group'});
        const filterLabel = this.createElement('span', {className: 'control-label', textContent: this.isMobile ? '🔮' : '🔮 Фильтр:'});
        const filterSelect = this.createElement('select', {className: 'control-select', id: 'filterSelect'});
        
        const filterOptions = [
            {value: 'all', text: this.isMobile ? 'Все' : 'Все задания'},
            {value: 'active', text: this.isMobile ? 'Активные' : 'Активные'},
            {value: 'completed', text: this.isMobile ? 'Готово' : 'Завершённые'}
        ];
        
        filterOptions.forEach(option => {
            const optElement = this.createElement('option', {value: option.value, textContent: option.text});
            filterSelect.appendChild(optElement);
        });
        
        filterGroup.appendChild(filterLabel);
        filterGroup.appendChild(filterSelect);

        const sortGroup = this.createElement('div', {className: 'control-group'});
        const sortLabel = this.createElement('span', {className: 'control-label', textContent: this.isMobile ? '🦇' : '🦇 Сортировка:'});
        const sortSelect = this.createElement('select', {className: 'control-select', id: 'sortSelect'});
        
        const sortOptions = [
            {value: 'date-desc', text: this.isMobile ? '📅 Новые' : 'Дата (новые)'},
            {value: 'date-asc', text: this.isMobile ? '📅 Старые' : 'Дата (старые)'},
            {value: 'text', text: this.isMobile ? '🔤 По имени' : 'По названию'}
        ];
        
        sortOptions.forEach(option => {
            const optElement = this.createElement('option', {value: option.value, textContent: option.text});
            sortSelect.appendChild(optElement);
        });
        
        sortGroup.appendChild(sortLabel);
        sortGroup.appendChild(sortSelect);

        const searchGroup = this.createElement('div', {className: 'control-group'});
        const searchLabel = this.createElement('span', {className: 'control-label', textContent: this.isMobile ? '🔍' : '🔍 Поиск:'});
        const searchInput = this.createElement('input', {
            type: 'text',
            className: 'control-input',
            placeholder: this.isMobile ? 'Поиск...' : 'Поиск жутких задач...',
            id: 'searchInput'
        });
        
        searchGroup.appendChild(searchLabel);
        searchGroup.appendChild(searchInput);

        controls.appendChild(filterGroup);
        controls.appendChild(sortGroup);
        controls.appendChild(searchGroup);

        const todoList = this.createElement('div', {className: 'todo-list', id: 'todoList'});

        container.appendChild(header);
        container.appendChild(todoForm);
        container.appendChild(controls);
        container.appendChild(todoList);
        app.appendChild(container);

        dateInput.valueAsDate = new Date();
    }

    applyHalloweenStyles() {
        const style = this.createElement('style');
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Courier New', monospace;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d1b00 100%);
                min-height: 100vh;
                padding: 10px;
                color: #ff6b00;
            }

            .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(26, 26, 26, 0.95);
                border-radius: 15px;
                border: 2px solid #ff6b00;
                box-shadow: 0 0 30px rgba(255, 107, 0, 0.3);
                overflow: hidden;
            }

            .header {
                background: linear-gradient(135deg, #8b0000 0%, #ff4500 100%);
                color: #ffd700;
                padding: 20px 15px;
                text-align: center;
            }

            .header h1 {
                font-size: 1.8rem;
                margin-bottom: 8px;
                text-shadow: 2px 2px 0 #000;
            }

            .header p {
                opacity: 0.9;
                font-size: 0.9rem;
            }

            .todo-form {
                padding: 20px 15px;
                background: rgba(139, 0, 0, 0.1);
                border-bottom: 2px solid #ff6b00;
            }

            .form-group {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                flex-direction: column;
            }

            .form-input {
                padding: 12px 15px;
                border: 2px solid #ff6b00;
                border-radius: 8px;
                font-size: 16px;
                background: rgba(26, 26, 26, 0.8);
                color: #ffd700;
                font-family: 'Courier New', monospace;
                width: 100%;
            }

            .form-input:focus {
                outline: none;
                border-color: #ffd700;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }

            .btn {
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s;
                font-family: 'Courier New', monospace;
                width: 100%;
            }

            .btn-primary {
                background: linear-gradient(135deg, #ff6b00 0%, #8b0000 100%);
                color: #ffd700;
                border: 2px solid #ffd700;
            }

            .btn-primary:hover {
                background: linear-gradient(135deg, #ff4500 0%, #660000 100%);
                transform: translateY(-2px);
            }

            .controls {
                padding: 15px;
                background: rgba(139, 0, 0, 0.1);
                border-bottom: 2px solid #ff6b00;
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
                align-items: center;
            }

            .control-group {
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
                min-width: 120px;
            }

            .control-label {
                font-weight: 600;
                color: #ffd700;
                font-size: 0.9rem;
                white-space: nowrap;
            }

            .control-select,
            .control-input {
                padding: 8px 10px;
                border: 2px solid #ff6b00;
                border-radius: 6px;
                font-size: 14px;
                background: rgba(26, 26, 26, 0.8);
                color: #ffd700;
                font-family: 'Courier New', monospace;
                flex: 1;
                min-width: 0;
            }

            .todo-list {
                padding: 0;
                min-height: 300px;
                background: rgba(26, 26, 26, 0.9);
            }

            .todo-item {
                display: flex;
                align-items: flex-start;
                padding: 15px;
                border-bottom: 1px solid #ff6b00;
                background: rgba(40, 40, 40, 0.8);
                transition: all 0.3s;
                cursor: grab;
                gap: 12px;
            }

            .todo-item:hover {
                background: rgba(139, 0, 0, 0.2);
            }

            .todo-item.dragging {
                opacity: 0.5;
                background: rgba(139, 0, 0, 0.3);
            }

            .todo-item.completed {
                background: rgba(0, 100, 0, 0.2);
                opacity: 0.8;
            }

            .todo-checkbox {
                width: 20px;
                height: 20px;
                margin-top: 2px;
                cursor: pointer;
                accent-color: #ff6b00;
                flex-shrink: 0;
            }

            .todo-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-width: 0;
            }

            .todo-text {
                font-size: 14px;
                color: #ffd700;
                line-height: 1.4;
                word-break: break-word;
            }

            .todo-item.completed .todo-text {
                text-decoration: line-through;
                color: #ff6b00;
            }

            .todo-date {
                font-size: 11px;
                color: #ff6b00;
            }

            .todo-actions {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
            }

            .btn-edit,
            .btn-delete {
                padding: 6px 10px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s;
                min-width: 40px;
            }

            .btn-edit {
                background: #ffd700;
                color: #8b0000;
            }

            .btn-edit:hover {
                background: #ffed4e;
            }

            .btn-delete {
                background: #8b0000;
                color: #ffd700;
            }

            .btn-delete:hover {
                background: #a00;
            }

            .empty-state {
                text-align: center;
                padding: 40px 20px;
                color: #ff6b00;
            }

            .empty-state h3 {
                margin-bottom: 10px;
                font-size: 1.2rem;
            }

            .empty-state p {
                font-size: 0.9rem;
            }

            .edit-form {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 15px;
                background: rgba(139, 0, 0, 0.2);
                border-radius: 8px;
                margin-top: 10px;
                border: 2px solid #ffd700;
            }

            .edit-input {
                padding: 10px;
                border: 2px solid #ff6b00;
                border-radius: 6px;
                font-size: 14px;
                background: rgba(26, 26, 26, 0.9);
                color: #ffd700;
                width: 100%;
            }

            .edit-actions {
                display: flex;
                gap: 8px;
            }

            .btn-save {
                background: #008000;
                color: #ffd700;
                flex: 1;
            }

            .btn-save:hover {
                background: #00a000;
            }

            .btn-cancel {
                background: #666;
                color: #ffd700;
                flex: 1;
            }

            .btn-cancel:hover {
                background: #888;
            }

            @media (min-width: 769px) {
                body {
                    padding: 20px;
                }

                .header {
                    padding: 30px;
                }

                .header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }

                .header p {
                    font-size: 1rem;
                }

                .todo-form {
                    padding: 30px;
                }

                .form-group {
                    flex-direction: row;
                    gap: 15px;
                }

                .form-input {
                    width: auto;
                    flex: 1;
                }

                .btn {
                    width: auto;
                    padding: 12px 25px;
                }

                .controls {
                    padding: 20px 30px;
                    gap: 15px;
                }

                .control-group {
                    flex: none;
                    min-width: auto;
                }

                .control-label {
                    font-size: 1rem;
                }

                .todo-list {
                    min-height: 400px;
                }

                .todo-item {
                    align-items: center;
                    padding: 20px 30px;
                    gap: 15px;
                }

                .todo-checkbox {
                    margin-top: 0;
                    margin-right: 0;
                }

                .todo-text {
                    font-size: 16px;
                }

                .todo-date {
                    font-size: 12px;
                }

                .btn-edit,
                .btn-delete {
                    padding: 8px 12px;
                    font-size: 14px;
                    min-width: auto;
                }

                .empty-state {
                    padding: 60px 30px;
                }

                .empty-state h3 {
                    font-size: 1.5rem;
                }

                .empty-state p {
                    font-size: 1rem;
                }
            }

            @media (min-width: 481px) and (max-width: 768px) {
                .form-group {
                    flex-direction: row;
                    flex-wrap: wrap;
                }

                .form-input {
                    min-width: 200px;
                }

                .btn {
                    width: auto;
                    min-width: 140px;
                }

                .controls {
                    justify-content: center;
                }

                .control-group {
                    flex: none;
                }
            }

            @media (max-width: 480px) {
                .container {
                    border-radius: 10px;
                    margin: 5px;
                }

                .header {
                    padding: 15px 10px;
                }

                .header h1 {
                    font-size: 1.5rem;
                }

                .header p {
                    font-size: 0.8rem;
                }

                .todo-form {
                    padding: 15px 10px;
                }

                .controls {
                    padding: 10px;
                    gap: 8px;
                }

                .control-group {
                    min-width: 100px;
                }

                .control-label {
                    font-size: 0.8rem;
                }

                .control-select,
                .control-input {
                    padding: 6px 8px;
                    font-size: 12px;
                }

                .todo-item {
                    padding: 12px 10px;
                }

                .todo-actions {
                    flex-direction: column;
                    gap: 4px;
                }

                .btn-edit,
                .btn-delete {
                    padding: 4px 8px;
                    font-size: 11px;
                    min-width: 35px;
                }
            }

            @media (max-width: 320px) {
                .header h1 {
                    font-size: 1.3rem;
                }

                .control-group {
                    min-width: 90px;
                }

                .todo-text {
                    font-size: 13px;
                }

                .todo-date {
                    font-size: 10px;
                }
            }

            @media (hover: none) and (pointer: coarse) {
                .btn:hover,
                .btn-edit:hover,
                .btn-delete:hover {
                    transform: none;
                }

                .todo-item:hover {
                    transform: none;
                    background: rgba(40, 40, 40, 0.8);
                }

                .todo-item:active {
                    background: rgba(139, 0, 0, 0.2);
                }

                .btn:active,
                .btn-edit:active,
                .btn-delete:active {
                    transform: scale(0.98);
                }
            }

            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                .form-input,
                .control-select,
                .control-input,
                .edit-input {
                    border-width: 1.5px;
                }
            }

            @media (prefers-color-scheme: dark) {
                .form-input,
                .control-select,
                .control-input,
                .edit-input {
                    color-scheme: dark;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createTaskElement(task) {
        const taskElement = this.createElement('div', {
            className: `todo-item ${task.completed ? 'completed' : ''}`,
            'data-task-id': task.id,
            draggable: !this.isMobile 
        });
        
        const checkbox = this.createElement('input', {
            type: 'checkbox',
            className: 'todo-checkbox',
            checked: task.completed
        });
        
        const content = this.createElement('div', {className: 'todo-content'});
        const text = this.createElement('div', { 
            className: 'todo-text',
            textContent: task.text 
        });
        
        const date = this.createElement('div', { 
            className: 'todo-date',
            textContent: this.formatDate(task.date) 
        });
        
        content.appendChild(text);
        content.appendChild(date);
        
        const actions = this.createElement('div', {className: 'todo-actions'});
        const editBtn = this.createElement('button', {
            className: 'btn-edit',
            textContent: this.isMobile ? '✏️' : '🔮'
        });
        
        const deleteBtn = this.createElement('button', {
            className: 'btn-delete',
            textContent: this.isMobile ? '🗑️' : '💥'
        });
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(content);
        taskElement.appendChild(actions);
        
        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        editBtn.addEventListener('click', () => this.showEditForm(taskElement, task));
        
        if (this.isMobile) {
            this.addMobileTouchEvents(taskElement);
        }
        
        return taskElement;
    }

    addMobileTouchEvents(taskElement) {
        let pressTimer;
        
        taskElement.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                this.showMobileContextMenu(taskElement, e);
            }, 500);
        });
        
        taskElement.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
        
        taskElement.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        });
    }

    showMobileContextMenu(taskElement, event) {
        event.preventDefault();
        
        const taskId = parseInt(taskElement.dataset.taskId);
        const task = this.tasks.find(t => t.id === taskId);
        
        if (task) {
            const action = confirm(`${task.text}\n\nВыберите действие:\nOK - редактировать\nОтмена - удалить`);
            if (action) {
                this.showEditForm(taskElement, task);
            } else {
                this.deleteTask(taskId);
            }
        }
    }

    bindEvents() {
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        document.querySelector('.btn-primary').addEventListener('click', () => this.addTask());
        
        document.getElementById('filterSelect').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderTasks();
        });
        
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });
        
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.renderTasks();
        });
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');
        
        const text = taskInput.value.trim();
        const date = dateInput.value;
        
        if (!text) {
            alert('💀 Введите жуткую задачу!');
            return;
        }
        
        const task = {
            id: Date.now(),
            text: text,
            date: date,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        
        taskInput.value = '';
        taskInput.focus();
    }

    deleteTask(taskId) {
        if (confirm('🧨 Уверены, что хотите уничтожить эту задачу?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    editTask(taskId, newText, newDate) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && newText.trim()) {
            task.text = newText.trim();
            task.date = newDate;
            this.saveTasks();
            this.renderTasks();
        }
    }

    renderTasks() {
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';
        
        let filteredTasks = this.filterTasks(this.tasks);
        filteredTasks = this.sortTasks(filteredTasks);
        
        if (filteredTasks.length === 0) {
            const emptyState = this.createElement('div', {className: 'empty-state'});
            const messages = this.isMobile ? 
                ['🕸️ Пусто...', '👻 Нет задач!', '🎃 Ничего нет'] :
                ['🕸️ Паутина пуста...', '👻 Привидения разбежались!', '🎃 Тыквы молчат...'];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            const h3 = this.createElement('h3', {textContent: randomMessage});
            const p = this.createElement('p', {
                textContent: this.tasks.length === 0 ? 
                    (this.isMobile ? 'Добавьте задачу!' : 'Добавьте первую жуткую задачу!') : 
                    'Попробуйте изменить фильтры'
            });
            emptyState.appendChild(h3);
            emptyState.appendChild(p);
            todoList.appendChild(emptyState);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            todoList.appendChild(taskElement);
        });
        
        if (!this.isMobile) {
            this.initDragAndDrop();
        }
    }

    filterTasks(tasks) {
        let filtered = tasks;
        
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        }
        
        if (this.currentSearch) {
            filtered = filtered.filter(task => 
                task.text.toLowerCase().includes(this.currentSearch)
            );
        }
        
        return filtered;
    }

    sortTasks(tasks) {
        return [...tasks].sort((a, b) => {
            switch (this.currentSort) {
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'text':
                    return a.text.localeCompare(b.text);
                default:
                    return 0;
            }
        });
    }

    showEditForm(taskElement, task) {
        const editForm = this.createElement('div', {className: 'edit-form'});
        
        const textInput = this.createElement('input', {
            type: 'text',
            className: 'edit-input',
            value: task.text,
            placeholder: this.isMobile ? 'Редактировать...' : 'Измените жуткую задачу...'
        });
        
        const dateInput = this.createElement('input', {
            type: 'date',
            className: 'edit-input',
            value: task.date
        });
        
        const actions = this.createElement('div', {className: 'edit-actions'});
        const saveBtn = this.createElement('button', {
            className: 'btn btn-save',
            textContent: this.isMobile ? '💾' : '💾 Сохранить'
        });
        
        const cancelBtn = this.createElement('button', {
            className: 'btn btn-cancel',
            textContent: this.isMobile ? '❌' : '🚫 Отмена'
        });
        
        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
        editForm.appendChild(textInput);
        editForm.appendChild(dateInput);
        editForm.appendChild(actions);
        
        taskElement.innerHTML = '';
        taskElement.appendChild(editForm);
        textInput.focus();

        if (this.isMobile) {
            textInput.setAttribute('inputmode', 'text');
        }
        
        const saveHandler = () => {
            this.editTask(task.id, textInput.value, dateInput.value);
        };
        
        const cancelHandler = () => {
            this.renderTasks();
        };
        
        saveBtn.addEventListener('click', saveHandler);
        cancelBtn.addEventListener('click', cancelHandler);
        
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveHandler();
        });
    }

    initDragAndDrop() {
        const todoList = document.getElementById('todoList');
        let draggedItem = null;
        
        const items = todoList.querySelectorAll('.todo-item');
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedItem = item;
                setTimeout(() => item.classList.add('dragging'), 0);
            });
            
            item.addEventListener('dragend', () => {
                draggedItem = null;
                item.classList.remove('dragging');
            });
            
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            item.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem && draggedItem !== item) {
                    this.reorderTasks(
                        parseInt(draggedItem.dataset.taskId),
                        parseInt(item.dataset.taskId)
                    );
                }
            });
        });
    }

    reorderTasks(draggedId, targetId) {
        const draggedIndex = this.tasks.findIndex(t => t.id === draggedId);
        const targetIndex = this.tasks.findIndex(t => t.id === targetId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const [draggedTask] = this.tasks.splice(draggedIndex, 1);
            this.tasks.splice(targetIndex, 0, draggedTask);
            this.saveTasks();
            this.renderTasks();
        }
    }

    formatDate(dateString) {
        const options = this.isMobile ? 
            { year: 'numeric', month: 'short', day: 'numeric' } :
            { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    createElement(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else {
                element[key] = attributes[key];
            }
        });
        return element;
    }

    saveTasks() {
        localStorage.setItem('halloweenTodoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('halloweenTodoTasks');
        return saved ? JSON.parse(saved) : [];
    }

    addHalloweenEffects() {
        console.log('🎃 Хэллуинские эффекты активированы!');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
