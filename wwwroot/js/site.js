document.addEventListener('DOMContentLoaded', function () {
    // Завантажуємо завдання з LocalStorage при завантаженні сторінки
    loadTasksFromLocalStorage();

    // Обробляємо додавання нових завдань
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault(); // Відміна стандартної дії форми для попередження перезавантаження сторінки
        const taskInput = document.querySelector('input[name="task"]');
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTaskToView(taskText, false); // Додаємо нове завдання у список
            saveTasksToLocalStorage(); // Зберігаємо в LocalStorage
            taskInput.value = ''; // Очищуємо поле вводу після додавання завдання
        }
    });

    // Зберігаємо стан після зміни завдань (виконано / не виконано)
    document.querySelector('#task-list').addEventListener('click', function (e) {
        const li = e.target.closest('li');

        if (e.target.tagName === 'BUTTON') {
            if (e.target.classList.contains('complete-btn')) {
                li.classList.toggle('completed'); // Змінюємо стан виконання завдання
            } else if (e.target.classList.contains('delete-btn')) {
                li.remove(); // Видаляємо завдання з інтерфейсу
            }

            saveTasksToLocalStorage(); // Зберігаємо оновлений стан в LocalStorage
        }
    });

    // Drag-n-Drop логіка
    let draggedItem = null;

    document.querySelector('#task-list').addEventListener('dragstart', function (e) {
        if (e.target.tagName === 'LI') {
            draggedItem = e.target;
            setTimeout(function () {
                e.target.style.display = 'none';
            }, 0);
        }
    });

    document.querySelector('#task-list').addEventListener('dragend', function (e) {
        setTimeout(function () {
            draggedItem.style.display = 'block';
            draggedItem = null;
            saveTasksToLocalStorage(); // Зберігаємо порядок після переміщення
        }, 0);
    });

    document.querySelector('#task-list').addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    document.querySelector('#task-list').addEventListener('dragenter', function (e) {
        if (e.target.tagName === 'LI') {
            e.target.style.borderTop = '2px solid #000';
        }
    });

    document.querySelector('#task-list').addEventListener('dragleave', function (e) {
        if (e.target.tagName === 'LI') {
            e.target.style.borderTop = 'none';
        }
    });

    document.querySelector('#task-list').addEventListener('drop', function (e) {
        e.preventDefault();
        if (e.target.tagName === 'LI') {
            e.target.style.borderTop = 'none';
            if (draggedItem !== e.target) {
                const allItems = Array.from(document.querySelectorAll('#task-list li'));
                const draggedIndex = allItems.indexOf(draggedItem);
                const targetIndex = allItems.indexOf(e.target);

                if (draggedIndex < targetIndex) {
                    e.target.after(draggedItem);
                } else {
                    e.target.before(draggedItem);
                }

                saveTasksToLocalStorage(); // Зберігаємо новий порядок після зміни
            }
        }
    });
});

function loadTasksFromLocalStorage() {
    // Очищуємо список перед завантаженням завдань
    document.querySelector('#task-list').innerHTML = '';

    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            addTaskToView(task.task, task.isCompleted);
        });
    }
}

function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach(li => {
        tasks.push({
            task: li.querySelector('span').innerText.trim(),
            isCompleted: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTaskToView(task, isCompleted) {
    const li = document.createElement('li');
    li.classList.toggle('completed', isCompleted);
    li.setAttribute('draggable', true); // Додаємо атрибут для Drag-n-Drop
    li.innerHTML = `
        <span>${task}</span>
        <button type="button" class="complete-btn">${isCompleted ? 'Undo' : 'Complete'}</button>
        <button type="button" class="delete-btn">Delete</button>
    `;
    document.querySelector('#task-list').appendChild(li);
}

