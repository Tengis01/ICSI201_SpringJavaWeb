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
        console.error('Даалгавруудыг татхад алдаа гарлаа:', error);
        todoList.innerHTML = '<p>Даалгавруудыг татах боломжгүй байна. Spring Boot сервер ажиллаж байгаа эсэхийг шалгана уу.</p>';
    }
}

// 2. Дэлгэцэнд харуулах
function renderTodos(todos) {
    todoList.innerHTML = '';

    if (!todos || todos.length === 0) {
        todoList.innerHTML = '<p>Одоогоор төлөвлөсөн даалгавар алга.</p>';
        return;
    }

    todos.forEach(todo => {
        const item = document.createElement('div');
        item.classList.add('todo-item');

        item.innerHTML = `
            <div>
                <h3>${todo.title}</h3>
                <p><strong>Тайлбар:</strong> ${todo.description ?? ''}</p>
                <p>
                    <strong>Эхлэх:</strong> ${todo.startDate ?? ''} |
                    <strong>Дуусгах:</strong> ${todo.dueDate ?? ''}
                </p>
            </div>
            <button class="delete-btn" data-id="${todo.id}">Устгах</button>
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
            console.error('Даалгавар үүсгэх амжилтгүй боллоо. Статус:', response.status);
        }

    } catch (error) {
        console.error('Даалгавар үүсгэхэд алдаа гарлаа:', error);
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
            console.error('Устгах амжилтгүй боллоо. Статус:', response.status);
        }

    } catch (error) {
        console.error('Даалгавар устгахад алдаа гарлаа:', error);
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
