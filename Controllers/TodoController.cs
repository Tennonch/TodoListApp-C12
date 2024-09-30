using Microsoft.AspNetCore.Mvc;
using TodoListApp_C12.Models;
using System.Collections.Generic;

namespace TodoListApp_C12.Controllers
{
    public class TodoController : Controller
    {
        // Список для зберігання завдань
        private static List<TodoItem> tasks = new List<TodoItem>();

        // Відображення списку завдань
        public IActionResult Index()
        {
            return View(tasks); // Передаємо список завдань у View
        }

        // Додавання нового завдання
        [HttpPost]
        public IActionResult Add(string task)
        {
            if (!string.IsNullOrEmpty(task))
            {
                tasks.Add(new TodoItem { Id = tasks.Count + 1, Task = task, IsCompleted = false });
            }
            return RedirectToAction("Index");
        }

        // Зміна статусу завдання (виконано/не виконано)
        [HttpPost]
        public IActionResult ToggleComplete(int id)
        {
            var task = tasks.Find(t => t.Id == id);
            if (task != null)
            {
                task.IsCompleted = !task.IsCompleted;
            }
            return RedirectToAction("Index");
        }
    }
}
