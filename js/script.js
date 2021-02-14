'use strict';

const headerInput = document.querySelector('.header-input');
const todoControl = document.querySelector('.todo-control');
const todoList = document.querySelector('.todo-list');
const todoCompleted = document.querySelector('.todo-completed');

/**
 * Объект todо - листа
 * @type {{todo: [], add: todoObj.add, setToStorage: todoObj.setToStorage, init: todoObj.init,
 * getFromStorage: todoObj.getFromStorage, getOne: (function(*): number), delete: todoObj.delete,
 * render: todoObj.render}}
 */
let todoObj = {
    todo: [],           //массив с делами
    /**
     * Инициализация объекта, получение данных и рендер
     */
    init: function() {
        this.getFromStorage();
        this.render();
    },
    /**
     * Функция добавления нового дела
     * Создаем объект, добавляем в массив, пишем в localStorage, рендерим
     * @param value
     */
    add: function(value){
        if (value){
            let newToDo = {
                value: value,
                completed: false
            };
            this.todo.push(newToDo);
            this.setToStorage();
            this.render();
        }
    },
    /**
     * Функция  удаления элемента
     * @param element - ссылка на конкретный элемент, который надо удалить
     */
    delete: function(element) {
        //удаляем элемент по индексу
        if(element){
            todoObj.todo.splice(todoObj.todo.indexOf(element),1);
            this.setToStorage();        //пишем в storage
            this.render();              //рендерим
        }
    },
    /**
     * Функция получения из localStorage
     */
    getFromStorage: function() {
        if (localStorage.todoList){
            this.todo = JSON.parse(localStorage.todoList);
        }
    },
    /**
     * Функция записи в localStorage
     */
    setToStorage: function() {
        localStorage.todoList = JSON.stringify(this.todo);
    },
    /**
     * функция получения ссылки на элемент по значению value
     * @param value - текст дела
     * @returns {number} - ссылка на объект в массиве todo
     */
    // P.S. - вообще правильнее это делать по id конечно, оно точно будет уникальным)))
    getOne: function(value) {
        let target = 0;
        if(value){
            this.todo.forEach(function (item) {
                if( value === item.value){
                    target = item;
                }
            });
        }
        return target;
    },
    /**
     * Функция рендера всего todo - листа
     */
    render: function () {
        todoCompleted.innerHTML = '';       //чистим лист
        todoList.innerHTML = '';
        this.todo.forEach( function (item) {            //пробегаемся по всему массиву с объектами
            let li = document.createElement('li');      //создаем элемент
            li.classList.add('todo-item');
            li.innerHTML = `<span class="text-todo">${item.value}</span>` +     //заполняем
                `<div class="todo-buttons">` +
                `<button class="todo-remove"></button>` +
                `<button class="todo-complete"></button>` +
                `</div>`;
            if(item.completed){                                     //отрисовываем
                todoCompleted.append(li);
            } else {
                todoList.append(li);
            }
            let todoText = li.querySelector('.text-todo');//ищем нужные кнопки
            let removeBtn = li.querySelector('.todo-remove');
            removeBtn.addEventListener('click', function (e) {  //навешиваем удаление
                todoObj.delete(todoObj.getOne(todoText.textContent));       //находим элемент по тексту и удаляем
            });
            let completeBtn = li.querySelector('.todo-complete');       //находим кнопку выполения
            completeBtn.addEventListener('click', function () {     //навешиваем событие выполения
                let item = todoObj.getOne(todoText.textContent);                //находим нужный объект в массиве
                item.completed = !item.completed;                               //реверс
                todoObj.render();
                todoObj.setToStorage();
            });

        });


    }
};
//инициализируем объект
todoObj.init();
//навешиваем событие на форму добавления
todoControl.addEventListener('submit', function (e) {
    e.preventDefault();
    let val = headerInput.value;
    if(val){
        todoObj.add(val);
    }else {
        alert("Вы не ввели значение!")
    }
    headerInput.value = '';
});








