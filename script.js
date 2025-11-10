import { createElement, createButton, createInput, createSelect } from './elements.js';
import { Modal } from './modal.js';

class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentSort = 'date-desc';
        this.currentSearch = '';
        this.isMobile = this.checkMobile();
        this.modal = new Modal();
        this.init();
    }

    init() {
        this.createAppStructure();
        this.renderTasks();
        this.bindEvents();
        this.setupResponsive();
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
        const app = document.getElementById('app') || createElement('div', {id: 'app'});
        document.body.appendChild(app);

        const container = createElement('div', {className: 'container'});
        
        const header = createElement('div', {className: 'header'});
        const h1 = createElement('h1', {textContent: this.isMobile ? '🎃 ToDo 👻' : '🎃 Хэллуин ToDo 👻'});
        const p = createElement('p', {textContent: this.isMobile ? 'Жуткие задачи' : 'Управляйте своими жуткими задачами!'});
        header.appendChild(h1);
        header.appendChild(p);

        const todoForm = createElement('div', {className: 'todo-form'});
        const formGroup = createElement('div', {className: 'form-group'});
        
        const taskInput = createInput({
            type: 'text',
            placeholder: this.isMobile ? 'Новая задача...' : 'Добавьте жуткую задачу...',
            id: 'taskInput'
        });
        
        const dateInput = createInput({
            type: 'date',
            id: 'dateInput'
        });
        
        const addButton = createButton({
            text: this.isMobile ? '🎃 Добавить' : '🎃 Добавить задачу',
            className: 'btn-primary',
            onClick: () => this.addTask()
        });
        
        formGroup.appendChild(taskInput);
        formGroup.appendChild(dateInput);
        formGroup.appendChild(addButton);
        todoForm.appendChild(formGroup);

        const controls = createElement('div', {className: 'controls'});
        
        const filterGroup = createElement('div', {className: 'control-group'});
        const filterLabel = createElement('span', {className: 'control-label', textContent: this.isMobile ? '🔮' : '🔮 Фильтр:'});
        const filterSelect = createSelect({
            options: [
                {value: 'all', text: this.isMobile ? 'Все' : 'Все задания'},
                {value: 'active', text: this.isMobile ? 'Активные' : 'Активные'},
                {value: 'completed', text: this.isMobile ? 'Готово' : 'Завершённые'}
            ],
            id: 'filterSelect',
            onChange: (e) => {
                this.currentFilter = e.target.value;
                this.renderTasks();
            }
        });
        
        filterGroup.appendChild(filterLabel);
        filterGroup.appendChild(filterSelect);

        const sortGroup = createElement('div', {className: 'control-group'});
        const sortLabel = createElement('span', {className: 'control-label', textContent: this.isMobile ? '🦇' : '🦇 Сортировка:'});
        const sortSelect = createSelect({
            options: [
                {value: 'date-desc', text: this.isMobile ? '📅 Новые' : 'Дата (новые)'},
                {value: 'date-asc', text: this.isMobile ? '📅 Старые' : 'Дата (старые)'},
                {value: 'text', text: this.isMobile ? '🔤 По имени' : 'По названию'}
            ],
            id: 'sortSelect',
            onChange: (e) => {
                this.currentSort = e.target.value;
                this.renderTasks();
            }
        });
        
        sortGroup.appendChild(sortLabel);
        sortGroup.appendChild(sortSelect);

        const searchGroup = createElement('div', {className: 'control-group'});
        const searchLabel = createElement('span', {className: 'control-label', textContent: this.isMobile ? '🔍' : '🔍 Поиск:'});
        const searchInput = createInput({
            type: 'text',
            className: 'control-input',
            placeholder: this.isMobile ? 'Поиск...' : 'Поиск жутких задач...',
            id: 'searchInput'
        });
        
        searchGroup.appendChild(searchLabel);
        searchGroup.appendChild(searchInput);

        const bulkGroup = createElement('div', {className: 'control-group'});
        const selectAllBtn = createButton({
            text: '☑ Все',
            className: 'btn-secondary',
            onClick: () => this.selectAllTasks()
        });
        const clearCompletedBtn = createButton({
            text: '🧹 Очистить',
            className: 'btn-secondary',
            onClick: () => this.clearCompletedTasks()
        });
        
        bulkGroup.appendChild(selectAllBtn);
        bulkGroup.appendChild(clearCompletedBtn);

        controls.appendChild(filterGroup);
        controls.appendChild(sortGroup);
        controls.appendChild(searchGroup);
        controls.appendChild(bulkGroup);

        const todoList = createElement('div', {className: 'todo-list', id: 'todoList'});

        container.appendChild(header);
        container.appendChild(todoForm);
        container.appendChild(controls);
        container.appendChild(todoList);
        app.appendChild(container);

        dateInput.valueAsDate = new Date();
    }

    createTaskElement(task) {
        const taskElement = createElement('div', {
            className: `todo-item ${task.completed ? 'completed' : ''}`,
            dataset: { taskId: task.id },
            draggable: !this.isMobile 
        });
        
        const checkbox = createElement('input', {
            type: 'checkbox',
            className: 'todo-checkbox',
            checked: task.completed
        });
        
        const content = createElement('div', {className: 'todo-content'});
        const text = createElement('div', { 
            className: 'todo-text',
            textContent: task.text 
        });
        
        const date = createElement('div', { 
            className: 'todo-date',
            textContent: this.formatDate(task.date) 
        });
        
        content.appendChild(text);
        content.appendChild(date);
        
        const actions = createElement('div', {className: 'todo-actions'});
        const editBtn = createButton({
            text: this.isMobile ? '✏️' : '🔮',
            className: 'btn-edit',
            onClick: () => this.showEditForm(taskElement, task)
        });
        
        const deleteBtn = createButton({
            text: this.isMobile ? '🗑️' : '💥',
            className: 'btn-delete',
            onClick: () => this.showDeleteConfirm(task.id, task.text)
        });
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        taskElement.appendChild(checkbox);
        taskElement.appendChild(content);
        taskElement.appendChild(actions);
        
        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        
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
            this.modal.show({
                title: 'Действие с задачей',
                message: `${task.text}\n\nВыберите действие:`,
                onConfirm: () => this.showEditForm(taskElement, task),
                onCancel: () => this.showDeleteConfirm(taskId, task.text)
            });
        }
    }

    bindEvents() {
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
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
            this.showMessage('💀 Введите жуткую задачу!');
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

    showDeleteConfirm(taskId, taskText) {
        this.modal.show({
            title: 'Удаление задачи',
            message: `🧨 Уверены, что хотите уничтожить задачу?\n"${taskText}"`,
            onConfirm: () => {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.saveTasks();
                this.renderTasks();
            }
        });
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    selectAllTasks() {
        const allCompleted = this.tasks.every(task => task.completed);
        this.tasks.forEach(task => {
            task.completed = !allCompleted;
        });
        this.saveTasks();
        this.renderTasks();
    }

    clearCompletedTasks() {
        const completedTasks = this.tasks.filter(task => task.completed);
        if (completedTasks.length === 0) {
            this.showMessage('🎃 Нет выполненных задач для очистки!');
            return;
        }

        this.modal.show({
            title: 'Очистка задач',
            message: `🧹 Удалить ${completedTasks.length} выполненных задач?`,
            onConfirm: () => {
                this.tasks = this.tasks.filter(task => !task.completed);
                this.saveTasks();
                this.renderTasks();
            }
        });
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
            const emptyState = createElement('div', {className: 'empty-state'});
            const messages = this.isMobile ? 
                ['🕸️ Пусто...', '👻 Нет задач!', '🎃 Ничего нет'] :
                ['🕸️ Паутина пуста...', '👻 Привидения разбежались!', '🎃 Тыквы молчат...'];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            
            const h3 = createElement('h3', {textContent: randomMessage});
            const p = createElement('p', {
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
        const editForm = createElement('div', {className: 'edit-form'});
        
        const textInput = createInput({
            type: 'text',
            className: 'edit-input',
            value: task.text,
            placeholder: this.isMobile ? 'Редактировать...' : 'Измените жуткую задачу...'
        });
        
        const dateInput = createInput({
            type: 'date',
            className: 'edit-input',
            value: task.date
        });
        
        const actions = createElement('div', {className: 'edit-actions'});
        const saveBtn = createButton({
            text: this.isMobile ? '💾' : '💾 Сохранить',
            className: 'btn-save'
        });
        
        const cancelBtn = createButton({
            text: this.isMobile ? '❌' : '🚫 Отмена',
            className: 'btn-cancel'
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

    showMessage(message) {
        this.modal.show({
            title: 'Сообщение',
            message: message,
            onConfirm: () => {},
            onCancel: null
        });
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
