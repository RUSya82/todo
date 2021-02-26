'use strict';


/**
 * Объект todо - листа
 * @type {{todo: [], add: todoObj.add, setToStorage: todoObj.setToStorage, init: todoObj.init,
 * getFromStorage: todoObj.getFromStorage, delete: todoObj.delete,
 * render: todoObj.render}}
 */
class TodoList {
    constructor(headerInput, todoControl, todoList, todoCompleted, todoContainer) {
        this.headerInput = document.querySelector(headerInput);
        this.todoControl = document.querySelector(todoControl);;
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoContainer = document.querySelector(todoContainer);
        this.todo = new Map();
        this.init();

    }
    /**
     * Инициализация объекта, получение данных и рендер
     */
    init() {
        this.getFromStorage();
        this.render();
        this.addListeners();
    };
    /**
     * Функция добавления нового дела
     * Создаем объект, добавляем в массив, пишем в localStorage, рендерим
     * @param value
     */
    add(value){
        if (value){
            let newToDo = {
                key: this.generateKey(),
                value: value,
                completed: false
            };
            this.todo.set(newToDo.key, newToDo);
            this.setToStorage();
            this.render();
        }
    };
    generateKey(){
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    /**
     * Функция  удаления элемента
     * @param element - ссылка на конкретный элемент, который надо удалить
     */
    delete(element) {
        //удаляем элемент по индексу
        if(element){
            this.todo.delete(element.key);
            this.setToStorage();        //пишем в storage
            this.render();              //рендерим
        }
    };
    /**
     * Функция получения из localStorage
     */
    getFromStorage() {
        if (localStorage.todoList){
            this.todo = new Map(JSON.parse(localStorage.getItem('todoList')));
        }
    };
    /**
     * Функция записи в localStorage
     */
    setToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todo]));
    }
    /**
     * Функция рендера всего todo - листа
     */
    render () {
        this.todoCompleted.innerHTML = '';       //чистим лист
        this.todoList.innerHTML = '';
        this.todo.forEach( (item) => {            //пробегаемся по всему массиву с объектами
            let li = document.createElement('li');      //создаем элемент
            li.classList.add('todo-item');
            li.key = item.key;
            li.innerHTML = `<span class="text-todo">${item.value}</span>` +     //заполняем
                `<div class="todo-buttons">` +
                `<button class="todo-remove"></button>` +
                `<button class="todo-complete"></button>` +
                `</div>`;
            if(item.completed){                                     //отрисовываем
                this.todoCompleted.append(li);
            } else {
                this.todoList.append(li);
            }
        });
    }

    /**
     * отмечаем дело выполненным
     * @param item
     */
    completedItem(item){
        item.completed = !item.completed;                               //реверс
        this.render();
        this.setToStorage();
    }

    /**
     * добавление слушателей
     */
    addListeners(){
        this.todoControl.addEventListener('submit', (e) => {
            e.preventDefault();
            let val = this.headerInput.value;
            if(val){
                todoObj.add(val);
            }else {
                alert("Вы не ввели значение!")
            }
            this.headerInput.value = '';
        });
        this.todoContainer.addEventListener('click', (e) => {
            let target = e.target;
            let elemLi = target.closest('.todo-item');
            if(target.matches('.todo-remove')){
                this.delete(this.todo.get(elemLi.key));
            }
            if(target.matches('.todo-complete')){
                this.completedItem(this.todo.get(elemLi.key));
            }
        });
    }
};

//инициализируем объект
let todoObj = new TodoList('.header-input','.todo-control', '.todo-list', '.todo-completed', '.todo-container');
//todoObj.init();
//навешиваем событие на форму добавления









