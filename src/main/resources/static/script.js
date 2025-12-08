// script.js
// API-ийг холбох үндсэн URL (Spring Boot дээр @RequestMapping("/todos") гэж байгаа)
const API_URL = '/todos';

// HTML элементүүдийг авах
const todoForm = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const startDateInput = document.getElementById('startDate');
const dueDateInput = document.getElementById('dueDate');

// 1. Бүх даалгаврыг API-аас татаж авах (GET)
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Server response: ' + response.status);
        }

        const todos = await response.json();
        renderTodos(todos);

    } catch (error) {
        console.error('Daalgavruudiig tatahad aldaa garlaa:', error);
        todoList.innerHTML = '<p>Daalgavruudiig tatah bolomjgui bna. Spring Boot server ajillaj baigaa esehiig shalgana uu.</p>';
    }
}

// 2. Дэлгэцэнд харуулах
function renderTodos(todos) {
    todoList.innerHTML = '';

    if (!todos || todos.length === 0) {
        todoList.innerHTML = '<p>Odoo odoodoo daalgavar alga.</p>';
        return;
    }

    todos.forEach(todo => {
        const item = document.createElement('div');
        item.classList.add('todo-item');

        item.innerHTML = `
            <div>
                <h3>${todo.title}</h3>
                <p><strong>Tailbar:</strong> ${todo.description ?? ''}</p>
                <p>
                    <strong>Ekhleh:</strong> ${todo.startDate ?? ''} |
                    <strong>Duusgakh:</strong> ${todo.dueDate ?? ''}
                </p>
            </div>
            <button class="delete-btn" data-id="${todo.id}">Ustgah</button>
        `;

        todoList.appendChild(item);
    });

    // Устгах товчнуудад event listener залгах
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const todoId = e.target.getAttribute('data-id');
            deleteTodo(todoId);
        });
    });
}

// 3. Шинэ даалгавар үүсгэх (POST)
async function createTodo(newTodo) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        });

        if (response.ok) {
            await fetchTodos();
            todoForm.reset();
        } else {
            console.error('Daalgavar uusgeh amjiltgui bolloo. Status:', response.status);
        }

    } catch (error) {
        console.error('Daalgavar uusgehed aldaa garlaa:', error);
    }
}

// 4. Даалгавар устгах (DELETE)
async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        // Controller 200 OK + String буцааж байгаа, тиймээс response.ok гэж шалгана
        if (response.ok) {
            await fetchTodos();
        } else {
            console.error('Ustgakh amjiltgui, Status:', response.status);
        }

    } catch (error) {
        console.error('Daalgavar ustgakhad aldaa garlaa:', error);
    }
}

// Form submit-ийг боловсруулах
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTodo = {
        title: titleInput.value,
        description: descriptionInput.value,
        startDate: startDateInput.value, // YYYY-MM-DD
        dueDate: dueDateInput.value
        // completed талбарыг backend дээр default false гэж үзэж болно
    };

    createTodo(newTodo);
});

// Хуудас ачаалахад жагсаалтыг татах
fetchTodos();
