// script.js
// API-iig holboh undsen URL
const API_URL = 'http://localhost:8080/api/todos';

// HTML elementuudiig avah
const todoForm = document.getElementById('todoForm');
const todoList = document.getElementById('todoList');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const startDateInput = document.getElementById('startDate');
const dueDateInput = document.getElementById('dueDate');

// 1. Bugd Daalgavriig API-aas tataj avah function (GET)
async function fetchTodos() {
    try {
        // API ruu GET huselt yavuulah
        const response = await fetch(API_URL);
        // JSON format ruu horvuuleh
        const todos = await response.json(); 
        
        // Tataj avsan daalgavruudiig delgetsend haruulah
        renderTodos(todos);

    } catch (error) {
        console.error('Daalgavruudiig tatahad aldaa garlaa:', error);
        todoList.innerHTML = '<p>Daalgavruudiig tatah bolomjgui bna. Spring Boot Server ajillaj baigaa esehiig shalgana uu.</p>';
    }
}

// 2. Delgetsend haruulah function
function renderTodos(todos) {
    // Ehleed jagsaaltiin huuchin utgiig tseverleh
    todoList.innerHTML = ''; 

    // Hervee daalgavar baihgui bol
    if (todos.length === 0) {
        todoList.innerHTML = '<p>Odoo agaa daalgavar alga.</p>';
        return;
    }

    // Daalgavar tus buriig HTML element bolgon uusgeh
    todos.forEach(todo => {
        const item = document.createElement('div');
        item.classList.add('todo-item');
        
        // Item dotorh medeelliig buteeh
        item.innerHTML = `
            <div>
                <h3>${todo.title}</h3>
                <p><strong>Tailbar:</strong> ${todo.description}</p>
                <p><strong>Ekhleh:</strong> ${todo.startDate} | <strong>Duusgakh:</strong> ${todo.dueDate}</p>
            </div>
            <button class="delete-btn" data-id="${todo.id}">Ustgah</button>
        `;
        
        // Jagsaaltiin kontainer-t nemeh
        todoList.appendChild(item);
    });

    // Ustgah tovch deer darhad ajillah event listener-iig nemeh
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            // Tovch deerh data-id-aas daalgavriin ID-g avah
            const todoId = e.target.getAttribute('data-id');
            deleteTodo(todoId);
        });
    });
}


// 3. Shine Daalgavar uusgeh (POST)
async function createTodo(newTodo) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            // API-d JSON ogogdol ilgeej baigaag zaaj ogoh
            headers: { 'Content-Type': 'application/json' },
            // JSON string-ruu horvuuleh
            body: JSON.stringify(newTodo) 
        });

        if (response.ok) {
            // Amjilttai uusgevel jagsaaltyg shinechleh
            fetchTodos();
            // Form-iig tseverleh
            todoForm.reset(); 
        } else {
            console.error('Daalgavar uusgeh amjiltgui bolloo.');
        }

    } catch (error) {
        console.error('Daalgavar uusgehed aldaa garlaa:', error);
    }
}

// 4. Daalgavar ustgah (DELETE)
async function deleteTodo(id) {
    try {
        // ID-gaar ni API ruu DELETE huselt yavuulah
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 204) { // 204 No Content ni ustgah amjilttai bolson gesen utga
            // Amjilttai ustgasan tul jagsaaltyg shinechleh
            fetchTodos(); 
        } else {
             console.error('Ustgakh amjiltgui, Status:', response.status);
        }

    } catch (error) {
        console.error('Daalgavar ustgakhad aldaa garlaa:', error);
    }
}

// Form huseltiig avah uil ajillagaa
todoForm.addEventListener('submit', (e) => {
    // Form-iig avtomat submit hiih uildliig zogsooh
    e.preventDefault(); 

    // Form-oos ogogdliig avah
    const newTodo = {
        title: titleInput.value,
        description: descriptionInput.value,
        // Spring Boot-iin LocalDate-d tohiroh YYYY-MM-DD format
        startDate: startDateInput.value, 
        dueDate: dueDateInput.value 
    };

    // Shine daalgavar uusgeh function-iig duudah
    createTodo(newTodo);
});


// Program ehlehed bugdiig tataj avah
fetchTodos();