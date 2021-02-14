'use strict';

const headerInput = document.querySelector('.header-input');
const todoControl = document.querySelector('.todo-control');
const todoList = document.querySelector('.todo-list');
const todoCompleted = document.querySelector('.todo-completed');


let todoObj = {
    todo: [],
    init: function() {
        this.getFromStorage();
        this.render();
    },
    add: function(value){
        let newToDo = {
            value: value,
            completed: false
        };
        this.todo.push(newToDo);
        this.setToStorage();
        this.render();
    },
    delete: function(element) {
        todoObj.todo.splice(todoObj.todo.indexOf(element),1);
        this.setToStorage();
        this.render();
    },
    getFromStorage: function() {
        if (localStorage.todoList){
            this.todo = JSON.parse(localStorage.todoList);
        }


    },
    setToStorage: function() {
        localStorage.todoList = JSON.stringify(this.todo);
    },
    getOne: function(value) {
        let target = 0;
        this.todo.forEach(function (item) {
            if( value === item.value){
                target = item;
            }
        });
        return target;
    },
    render: function () {
        todoCompleted.innerHTML = '';
        todoList.innerHTML = '';
        this.todo.forEach( function (item) {
            let li = document.createElement('li');
            li.classList.add('todo-item');
            li.innerHTML = `<span class="text-todo">${item.value}</span>` +
                `<div class="todo-buttons">` +
                `<button class="todo-remove"></button>` +
                `<button class="todo-complete"></button>` +
                `</div>`;
            if(item.completed){
                todoCompleted.append(li);
            } else {
                todoList.append(li);
            }
            let todoText = li.querySelector('.text-todo');
            let removeBtn = li.querySelector('.todo-remove');;
            removeBtn.addEventListener('click', function (e) {
                todoObj.delete(todoObj.getOne(todoText.textContent));
            });
            let completeBtn = li.querySelector('.todo-complete');
            completeBtn.addEventListener('click', function () {
                let item = todoObj.getOne(todoText.textContent);
                item.completed = !item.completed;
                todoObj.render();
                todoObj.setToStorage();
            });

        });


    }
};
todoObj.init();
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








