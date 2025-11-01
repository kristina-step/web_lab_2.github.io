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
        
        const todoForm = this.createElement('div', {className: 'todo-form'});
        const formGroup = this.createElement('div', {className: 'form-group'});
        
        const taskInput = this.createElement('input', {
            type: 'text',
            className: 'form-input',
            placeholder: 'Добавьте жуткую задачу...',
            id: 'taskInput'
        });
        
        const dateInput = this.createElement('input', {
            type: 'date',
            className: 'form-input',
            id: 'dateInput'
        });
        
        const addButton = this.createElement('button', {
            className: 'btn btn-primary',
            textContent: '🎃 Добавить задачу'
        });
        
        formGroup.appendChild(taskInput);
        formGroup.appendChild(dateInput);
        formGroup.appendChild(addButton);
        todoForm.appendChild(formGroup);

        const controls = this.createElement('div', {className: 'controls'});
        
        const filterGroup = this.createElement('div', {className: 'control-group'});
        const filterLabel = this.createElement('span', {className: 'control-label', textContent: '🔮 Фильтр:'});
        const filterSelect = this.createElement('select', {className: 'control-select', id: 'filterSelect'});
        
        const filterOptions = [
            {value: 'all', text: 'Все задания'},
            {value: 'active', text: 'Активные'},
            {value: 'completed', text: 'Завершённые'}
        ];
        
        filterOptions.forEach(option => {
            const optElement = this.createElement('option', {value: option.value, textContent: option.text});
            filterSelect.appendChild(optElement);
        });
        
        filterGroup.appendChild(filterLabel);
        filterGroup.appendChild(filterSelect);

        const sortGroup = this.createElement('div', {className: 'control-group'});
        const sortLabel = this.createElement('span', {className: 'control-label', textContent: '🦇 Сортировка:'});
        const sortSelect = this.createElement('select', {className: 'control-select', id: 'sortSelect'});
        
        const sortOptions = [
            {value: 'date-desc', text: 'Дата (новые)'},
            {value: 'date-asc', text: 'Дата (старые)'},
            {value: 'text', text: 'По названию'}
        ];
        
        sortOptions.forEach(option => {
            const optElement = this.createElement('option', {value: option.value, textContent: option.text});
            sortSelect.appendChild(optElement);
        });
        
        sortGroup.appendChild(sortLabel);
        sortGroup.appendChild(sortSelect);

        const searchGroup = this.createElement('div', {className: 'control-group'});
        const searchLabel = this.createElement('span', {className: 'control-label', textContent: '🔍 Поиск:'});
        const searchInput = this.createElement('input', {
            type: 'text',
            className: 'control-input',
            placeholder: 'Поиск жутких задач...',
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
                padding: 20px;
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
                padding: 30px;
                text-align: center;
            }

            .header h1 {
                font-size: 2.5rem;
                margin-bottom: 10px;
                text-shadow: 2px 2px 0 #000;
            }

            .header p {
                opacity: 0.9;
            }

            .todo-form {
                padding: 30px;
                background: rgba(139, 0, 0, 0.1);
                border-bottom: 2px solid #ff6b00;
            }

            .form-group {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }

            .form-input {
                flex: 1;
                padding: 12px 15px;
                border: 2px solid #ff6b00;
                border-radius: 8px;
                font-size: 16px;
                background: rgba(26, 26, 26, 0.8);
                color: #ffd700;
                font-family: 'Courier New', monospace;
            }

            .form-input:focus {
                outline: none;
                border-color: #ffd700;
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
            }

            .btn {
                padding: 12px 25px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
                transition: all 0.3s;
                font-family: 'Courier New', monospace;
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
                padding: 20px 30px;
                background: rgba(139, 0, 0, 0.1);
                border-bottom: 2px solid #ff6b00;
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                align-items: center;
            }

            .control-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .control-label {
                font-weight: 600;
                color: #ffd700;
            }

            .control-select,
            .control-input {
                padding: 8px 12px;
                border: 2px solid #ff6b00;
                border-radius: 6px;
                font-size: 14px;
                background: rgba(26, 26, 26, 0.8);
                color: #ffd700;
                font-family: 'Courier New', monospace;
            }

            .todo-list {
                padding: 0;
                min-height: 400px;
                background: rgba(26, 26, 26, 0.9);
            }

            .todo-item {
                display: flex;
                align-items: center;
                padding: 20px 30px;
                border-bottom: 1px solid #ff6b00;
                background: rgba(40, 40, 40, 0.8);
                transition: all 0.3s;
                cursor: grab;
            }

            .todo-item:hover {
                background: rgba(139, 0, 0, 0.2);
                transform: translateX(5px);
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
                margin-right: 15px;
                cursor: pointer;
                accent-color: #ff6b00;
            }

            .todo-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .todo-text {
                font-size: 16px;
                color: #ffd700;
            }

            .todo-item.completed .todo-text {
                text-decoration: line-through;
                color: #ff6b00;
            }

            .todo-date {
                font-size: 12px;
                color: #ff6b00;
            }

            .todo-actions {
                display: flex;
                gap: 10px;
            }

            .btn-edit,
            .btn-delete {
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
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
                padding: 60px 30px;
                color: #ff6b00;
            }

            .empty-state h3 {
                margin-bottom: 10px;
                font-size: 1.5rem;
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
            }

            .edit-actions {
                display: flex;
                gap: 10px;
            }

            .btn-save {
                background: #008000;
                color: #ffd700;
            }

            .btn-save:hover {
                background: #00a000;
            }

            .btn-cancel {
                background: #666;
                color: #ffd700;
            }

            .btn-cancel:hover {
                background: #888;
            }

            @media (max-width: 768px) {
                .form-group {
                    flex-direction: column;
                }
                
                .controls {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .control-group {
                    justify-content: space-between;
                }
                
                .todo-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 15px;
                }
                
                .todo-actions {
                    align-self: flex-end;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addHalloweenEffects() {
        console.log('🎃 Хэллуинские эффекты активированы!');
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
            const h3 = this.createElement('h3', {textContent: '🕸️ Паутина пуста...'});
            const p = this.createElement('p', {
                textContent: this.tasks.length === 0 ? 'Добавьте первую жуткую задачу!' : 'Попробуйте изменить фильтры'
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
        
        this.initDragAndDrop();
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

    createTaskElement(task) {
        const taskElement = this.createElement('div', {
            className: `todo-item ${task.completed ? 'completed' : ''}`,
            'data-task-id': task.id,
            draggable: true
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
            textContent: '🔮'
        });
        
        const deleteBtn = this.createElement('button', {
            className: 'btn-delete',
            textContent: '💥'
        });
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(content);
        taskElement.appendChild(actions);
        
        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
        editBtn.addEventListener('click', () => this.showEditForm(taskElement, task));
        
        return taskElement;
    }

    showEditForm(taskElement, task) {
        const editForm = this.createElement('div', {className: 'edit-form'});
        
        const textInput = this.createElement('input', {
            type: 'text',
            className: 'edit-input',
            value: task.text
        });
        
        const dateInput = this.createElement('input', {
            type: 'date',
            className: 'edit-input',
            value: task.date
        });
        
        const actions = this.createElement('div', {className: 'edit-actions'});
        const saveBtn = this.createElement('button', {
            className: 'btn btn-save',
            textContent: '💾 Сохранить'
        });
        
        const cancelBtn = this.createElement('button', {
            className: 'btn btn-cancel',
            textContent: '🚫 Отмена'
        });
        
        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
        editForm.appendChild(textInput);
        editForm.appendChild(dateInput);
        editForm.appendChild(actions);
        
        taskElement.innerHTML = '';
        taskElement.appendChild(editForm);
        textInput.focus();
        
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
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'short'
        };
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
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
