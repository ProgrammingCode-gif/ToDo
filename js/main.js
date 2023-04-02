// Нахождение элементов страницы

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach((task) => renderTask(task))
}

checkEmptyList()


form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask)

// Функции
function addTask(event) {
    // Сброс события
    event.preventDefault();
    
    // Получение значения input
    const taskText = taskInput.value

    // Описывание задачи в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    // Добавление задачи в массив с задачами
    tasks.push(newTask)


    renderTask(newTask)

    // Очистка input
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
    saveToLocalStorage();
}

function deleteTask(event) {

    if(event.target.dataset.action !== 'delete') {
        return
    }


    const parentNode = event.target.closest('.list-group-item');

    // Определение ID задачи
    const id = Number(parentNode.id)

    // Находим индекс задачи в массиве
    const index = tasks.findIndex((task) => task.id === id)

    // Удаляем задачу из массива с задачами 
    tasks.splice(index, 1)
    
    // Удаляем задачу из разметки
    parentNode.remove();

    checkEmptyList();
    saveToLocalStorage();
}

function doneTask(event) {
    if(event.target.dataset.action !== 'done') {
        return;
    }

    const parentNode = event.target.closest('.list-group-item');

    // Определяем id задачи
    const id = Number(parentNode.id);

    const task = tasks.find((task) => task.id === id)
    task.done = !task.done

    console.log(task);

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
    saveToLocalStorage();
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                <div class="empty-list__title">Список дел пуст</div>
            </li>`;

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    // Формирование CSS класса 
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Разметка для новой задачи
    const taskHTML = `
    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
         <span class="${cssClass}">${task.text}</span>
         <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
            </button>
            <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
            </button>
        </div>
    </li>`;
 
    // Добавление задачи на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}