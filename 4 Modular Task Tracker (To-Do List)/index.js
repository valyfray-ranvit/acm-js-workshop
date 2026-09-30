
const Storage = (() => {
  const KEY = "task-tracker.tasks";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function save(tasks) {
    try {
      localStorage.setItem(KEY, JSON.stringify(tasks));
    } catch {
    }
  }

  return { load, save };
})();

const Tasks = (() => {
  let tasks = Storage.load();
  let filter = "all";

  const commit = () => Storage.save(tasks);

  function add(text) {
    text = text.trim();
    if (!text) return;
    tasks.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), text, done: false });
    commit();
  }

  function toggle(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    commit();
  }

  function remove(id) {
    tasks = tasks.filter(t => t.id !== id);
    commit();
  }

  function clearDone() {
    tasks = tasks.filter(t => !t.done);
    commit();
  }

  function setFilter(name) {
    filter = name;
  }

  function visible() {
    if (filter === "active") return tasks.filter(t => !t.done);
    if (filter === "done") return tasks.filter(t => t.done);
    return tasks;
  }

  const getFilter = () => filter;
  const remaining = () => tasks.filter(t => !t.done).length;
  const hasDone = () => tasks.some(t => t.done);

  return { add, toggle, remove, clearDone, setFilter, getFilter, visible, remaining, hasDone };
})();

const View = (() => {
  const el = {
    form: document.getElementById("task-form"),
    input: document.getElementById("task-input"),
    filters: document.getElementById("filters"),
    list: document.getElementById("task-list"),
    count: document.getElementById("task-count"),
    clearDone: document.getElementById("clear-done"),
  };

  function taskItem(task) {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");
    li.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "t-" + task.id;
    checkbox.checked = task.done;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.type = "button";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete task: " + task.text);

    li.append(checkbox, label, del);
    return li;
  }

  function render() {
    const items = Tasks.visible();
    el.list.replaceChildren(...items.map(taskItem));

    if (items.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = Tasks.getFilter() === "all" ? "No tasks yet. Add one above." : "Nothing here.";
      el.list.append(empty);
    }

    const n = Tasks.remaining();
    el.count.textContent = n === 1 ? "1 task left" : n + " tasks left";
    el.clearDone.disabled = !Tasks.hasDone();

    el.filters.querySelectorAll("button").forEach(b =>
      b.classList.toggle("active", b.dataset.filter === Tasks.getFilter())
    );
  }

  return { el, render };
})();

const App = (() => {
  function init() {
    const { el, render } = View;

    el.form.addEventListener("submit", e => {
      e.preventDefault();
      Tasks.add(el.input.value);
      el.input.value = "";
      render();
    });

    el.list.addEventListener("click", e => {
      const id = e.target.closest(".task")?.dataset.id;
      if (!id) return;
      if (e.target.matches(".delete")) {
        Tasks.remove(id);
        render();
      }
    });

    el.list.addEventListener("change", e => {
      const id = e.target.closest(".task")?.dataset.id;
      if (id && e.target.matches("input[type=checkbox]")) {
        Tasks.toggle(id);
        render();
      }
    });

    el.filters.addEventListener("click", e => {
      const name = e.target.dataset.filter;
      if (!name) return;
      Tasks.setFilter(name);
      render();
    });

    el.clearDone.addEventListener("click", () => {
      Tasks.clearDone();
      render();
    });

    render();
  }

  return { init };
})();

App.init();
