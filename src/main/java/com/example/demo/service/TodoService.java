package com.example.demo.service;

import com.example.demo.model.Todo;
import com.example.demo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    // Бүх Todo-г авах (READ)
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    // Нэг Todo авах (READ by ID)
    public Optional<Todo> getTodoById(int id) {
        return todoRepository.findById(id);
    }

    // Todo нэмэх (CREATE)
    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    // Todo засах (UPDATE)
    public Todo updateTodo(int id, Todo newTodo) {
        Todo oldTodo = todoRepository.findById(id).orElse(null);

        if (oldTodo != null) {
            oldTodo.setTitle(newTodo.getTitle());
            oldTodo.setDescription(newTodo.getDescription());
            oldTodo.setStartDate(newTodo.getStartDate());
            oldTodo.setDueDate(newTodo.getDueDate());
            oldTodo.setCompleted(newTodo.isCompleted());
            return todoRepository.save(oldTodo);
        }
        return null;
    }

    // Todo устгах (DELETE)
    public void deleteTodo(int id) {
        todoRepository.deleteById(id);
    }
}
