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
        this.todoControl = document.querySelector(todoControl);
        ;
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
    add(value) {
        if (value) {
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

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    /**
     * анимированное удаление дела (когда удаляем совсем
     * @param element
     */
    animate(element) {
        let start = performance.now();
        let ID;
        let duration = 300;
        let progress = 0;
        let popupAnimate = () => {
            let now = performance.now();
            progress = (now - start) / duration;
            let deg = 720 - 720 * progress;
            if (progress <= 1) {
                if (progress > 1) {
                    progress = 1;
                }
                element.style.transform = `scale(${(1 - progress)/2}) rotate(-${deg}deg)`;
                ID = requestAnimationFrame(popupAnimate);
            } else {
                cancelAnimationFrame(ID);
                element.remove();
            }
        };
        popupAnimate();
    }

    /**
     * анимированное появление элемента
     * @param element
     */
    animateOpacityUp(element) {
        let start = performance.now();
        let ID;
        let duration = 150;
        let progress = 0;
        let popupAnimate = () => {
            let now = performance.now();
            progress = (now - start) / duration;
            if (progress <= 1) {
                if (progress > 1) {
                    progress = 1;
                }

                element.style.transform = `scale(${(progress)})`;
                ID = requestAnimationFrame(popupAnimate);
            } else {
                cancelAnimationFrame(ID);
                element.style.transform = `scale(1)`;
            }
        };
        popupAnimate();
    }

    /**
     * анимированное удаление элемента (при выполнении дела используется)
     * @param element
     */
    animateOpacityDown(element) {
        let start = performance.now();
        let ID;
        let duration = 150;
        let progress = 0;
        let popupAnimate = () => {
            let now = performance.now();
            progress = (now - start) / duration;
            if (progress <= 1) {
                if (progress > 1) {
                    progress = 1;
                }
                element.style.transform = `scale(${((1 - progress))})`;
                ID = requestAnimationFrame(popupAnimate);
            } else {
                cancelAnimationFrame(ID);
                element.style.transform = `scale(0)`;
                element.remove();
            }
        };
        popupAnimate();
    }

    /**
     * Функция  удаления элемента
     * @param element - ссылка на конкретный элемент, который надо удалить
     */
    delete(element) {
        //удаляем элемент по индексу
        this.animate(element);
        if (element) {
            this.todo.delete(element.key);
            this.setToStorage();        //пишем в storage
        }


    };
    /**
     * отмечаем дело выполненным
     * @param item
     */
    completedItem(element) {
        let item = this.todo.get(element.key);
        item.completed = !item.completed;                               //реверс
        this.animateOpacityDown(element);
        setTimeout(() => {
            if (item.completed) {
                this.todoCompleted.append(element);
            } else {
                this.todoList.append(element);
            }
        }, 200);
        setTimeout(this.animateOpacityUp,200, element);
        this.setToStorage();
    }
    /**
     * Функция получения из localStorage
     */
    getFromStorage() {
        if (localStorage.todoList) {
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
    render() {
        this.todoCompleted.innerHTML = '';       //чистим лист
        this.todoList.innerHTML = '';
        this.todo.forEach((item) => {            //пробегаемся по всему массиву с объектами
            let li = document.createElement('li');      //создаем элемент
            li.classList.add('todo-item');
            li.key = item.key;
            li.innerHTML = `<span class="text-todo">${item.value}</span>` +     //заполняем
                `<div class="todo-buttons">` +
                `<button class="todo-remove"></button>` +
                `<button class="todo-complete"></button>` +
                `<button class="todo-edit"></button>` +
                `</div>`;
            if (item.completed) {                                     //отрисовываем
                this.todoCompleted.append(li);
            } else {
                this.todoList.append(li);
            }
        });
    }



    /**
     * добавление слушателей
     */
    addListeners() {
        this.todoControl.addEventListener('submit', (e) => {
            e.preventDefault();
            let val = this.headerInput.value;
            if (val) {
                //если есть редактируемое поле, то работаем только с ним
                let liEdited = document.querySelector('.edited');
                if(liEdited){
                    liEdited.querySelector('span').textContent = val;//пишем значение в span
                    let oldTodo = this.todo.get(liEdited.key);  //получаем todoшку
                    oldTodo.value = val;    //меняем значение
                    this.todo.set(oldTodo.key, oldTodo);    //пишем обратно
                    this.setToStorage();        //пишем
                    this.render();              //рендерим
                }else{
                    todoObj.add(val);//если нет редактируемых полей, то просто добавляем дело
                }

            } else {
                alert("Вы не ввели значение!")
            }
            this.headerInput.value = '';
        });
        this.todoContainer.addEventListener('click', (e) => {
            let target = e.target;
            let elemLi = target.closest('.todo-item');//li по которому кликнули
            //если по кнопке удаления
            if (target.matches('.todo-remove')) {
                this.delete(elemLi);
            }
            //по кнопке выполнения
            if (target.matches('.todo-complete')) {
                this.completedItem(elemLi);
            }
            //по кнопке редактирования
            if (target.matches('.todo-edit')) {
                elemLi.classList.toggle('edited');  //переключаем класс
                if(elemLi.classList.contains('edited')){        //если он есть
                    elemLi.style.backgroundColor = '#f5657b';       //меняем фон редактируемого дела
                    this.blockButtons(true, target);        //блокируем все остальные кнопки
                    this.headerInput.value = elemLi.querySelector('span').textContent;//значение в поле формы отправляем
                } else {
                    elemLi.style.backgroundColor = '#fff';  //если редактировать передумали, то возвращаем фон
                    this.blockButtons(false, target);//разблокируем кнопки
                }

            }
        });
    }

    /**
     * Блокировка всех кнопок, кроме target
     * @param block - true - блокировка, false - разблокировка
     * @param target - кнопка которую не блокируем
     */
    blockButtons(block, target){
        let buttons = document.querySelectorAll('button');
        buttons.forEach((item) => {
            if(!item.matches('.header-button') && item !== target){
                if(block){
                    item.setAttribute('disabled', 'true');
                } else{
                    item.removeAttribute('disabled');
                }

            }
        })
    }
};

//инициализируем объект
let todoObj = new TodoList('.header-input', '.todo-control', '.todo-list', '.todo-completed', '.todo-container');
//todoObj.init();
//навешиваем событие на форму добавления









