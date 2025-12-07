package com.example.demo.controllers;

import com.example.demo.model.Todo;
import com.example.demo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    // Бүх Todo-г авах (READ)
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    // Нэг Todo авах (READ by ID)
    @GetMapping("/{id}")
    public Todo getTodoById(@PathVariable int id) {
        return todoRepository.findById(id).orElse(null);
    }

    // Todo нэмэх (CREATE)
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoRepository.save(todo);
    }

    // Todo засах (UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable int id, @RequestBody Todo newTodo) {

        // id-г ашиглан oldTodo-г авах
        Todo oldTodo = todoRepository.findById(id).orElse(null);

        // Todo олдсон бол шинэ утгуудыг хадгалах
        if (oldTodo != null) {
            oldTodo.setTitle(newTodo.getTitle());
            oldTodo.setDescription(newTodo.getDescription());
            oldTodo.setStartDate(newTodo.getStartDate());
            oldTodo.setDueDate(newTodo.getDueDate());
            oldTodo.setCompleted(newTodo.isCompleted());

            // Todo-ийг шинэчлэх
            Todo updatedTodo = todoRepository.save(oldTodo);

            // Хэрэв шинэчлэлт амжилттай бол 200 OK буцаах
            return ResponseEntity.ok(updatedTodo);
        }

        // Хэрэв Todo олдоогүй бол 404 NOT FOUND буцаах
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(null);
    }

    // Todo устгах (DELETE)
    @DeleteMapping("/{id}")
    public String deleteTodo(@PathVariable int id) {
        todoRepository.deleteById(id);
        return "Todo deleted: " + id;
    }
}