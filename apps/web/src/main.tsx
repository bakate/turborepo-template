import {
	Badge,
	Button,
	Card,
	Code,
	Container,
	createTheme,
	type MantineColorsTuple,
	MantineProvider,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { StrictMode, type SubmitEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { useCreateTodoMachine } from "./features/todos/use-create-todo-machine";
import { useTodoListMachine } from "./features/todos/use-todo-list-machine";

const customColor: MantineColorsTuple = [
	"#f6eeff",
	"#e7d9f7",
	"#cab1ea",
	"#ad86dd",
	"#9462d2",
	"#854bcb",
	"#7d3fc9",
	"#6b31b2",
	"#5f2ba0",
	"#52238d",
];

const theme = createTheme({
	colors: {
		customColor,
	},
	primaryColor: "customColor",
	defaultRadius: "md",
	cursorType: "pointer",
});

function App() {
	const [todoListSnapshot, sendTodoListEvent] = useTodoListMachine();
	const [createTodoSnapshot, sendCreateTodoEvent] = useCreateTodoMachine();
	const [todoTitle, setTodoTitle] = useState("");

	useEffect(() => {
		sendTodoListEvent({ type: "TODOS.LOAD" });
	}, [sendTodoListEvent]);

	useEffect(() => {
		if (!createTodoSnapshot.matches("succeeded")) {
			return;
		}

		setTodoTitle("");
		sendTodoListEvent({ type: "TODOS.LOAD" });
		sendCreateTodoEvent({ type: "TODO.RESET" });
	}, [createTodoSnapshot, sendCreateTodoEvent, sendTodoListEvent]);

	const todos = todoListSnapshot.context.todos;
	const isLoading = todoListSnapshot.hasTag("loading");
	const isSubmitting = createTodoSnapshot.hasTag("submitting");
	const errorMessage = todoListSnapshot.context.errorMessage;
	const createTodoErrorMessage = createTodoSnapshot.context.errorMessage;

	function submitTodo(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		sendCreateTodoEvent({
			type: "TODO.CREATE",
			title: todoTitle,
		});
	}

	return (
		<MantineProvider theme={theme}>
			<Container py="xl" size="sm">
				<Stack gap="md">
					<Badge variant="light">React + Mantine</Badge>
					<Title order={1}>Frontend template</Title>
					<Text c="dimmed">
						This app consumes Mantine components through the workspace UI
						package and orchestrates data with framework-agnostic application
						machines.
					</Text>

					<Card withBorder>
						<form onSubmit={submitTodo}>
							<Stack gap="sm">
								<TextInput
									label="Todo title"
									onChange={(event) => setTodoTitle(event.currentTarget.value)}
									placeholder="Ship the frontend application layer"
									value={todoTitle}
								/>
								<Button loading={isSubmitting} type="submit">
									Create todo
								</Button>
								{createTodoErrorMessage !== null ? (
									<Text c="red" size="sm">
										{createTodoErrorMessage}
									</Text>
								) : null}
							</Stack>
						</form>
					</Card>

					<Card withBorder>
						<Stack gap="sm">
							<Button
								loading={isLoading}
								onClick={() => sendTodoListEvent({ type: "TODOS.LOAD" })}
								variant="light"
							>
								Load todos
							</Button>
							{errorMessage !== null ? (
								<Text c="red" size="sm">
									{errorMessage}
								</Text>
							) : null}
						</Stack>
					</Card>

					<Card withBorder>
						<Code block>
							{JSON.stringify(
								todos.map((todo) => ({
									...todo,
									createdAt: todo.createdAt.toLocaleString(),
									updatedAt: todo.updatedAt?.toLocaleString() ?? null,
								})),
								null,
								2,
							)}
						</Code>
					</Card>
				</Stack>
			</Container>
		</MantineProvider>
	);
}

const rootElement = document.querySelector("#app");

if (rootElement === null) {
	document.body.textContent = "Application root not found.";
} else {
	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
