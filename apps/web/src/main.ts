import { parseTodo } from "@workspace/domain/todos";

import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (app === null) {
	document.body.textContent = "Application root not found.";
} else {
	app.innerHTML = `
    <div>
      <h1>Domain Object Test</h1>
      <div class="card">
        <p id="todo-display">Loading...</p>
      </div>
    </div>
  `;
}

const exampleTodo = {
	id: 1,
	title: "Validate a shared domain model",
	completed: false,
	createdAt: new Date().toISOString(),
	updatedAt: null,
};

const result = parseTodo({ input: exampleTodo });
const display = document.querySelector("#todo-display");

if (display !== null && result.success) {
	const displayTodo = {
		...result.todo,
		createdAt: result.todo.createdAt.toLocaleString(),
		updatedAt: result.todo.updatedAt?.toLocaleString() ?? null,
	};

	display.innerHTML = `
    <pre>${JSON.stringify(displayTodo, null, 2)}</pre>
  `;
}

if (display !== null && !result.success) {
	display.textContent = result.issues.join(", ");
}
