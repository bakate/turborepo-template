import { parseTodo } from "@workspace/domain/todos";
import {
	Badge,
	Card,
	Code,
	Container,
	createTheme,
	type MantineColorsTuple,
	MantineProvider,
	Stack,
	Text,
	Title,
} from "@workspace/ui/core";
import "@workspace/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

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

const exampleTodo = {
	id: 1,
	title: "Validate a shared domain model",
	completed: false,
	createdAt: new Date().toISOString(),
	updatedAt: null,
};

function App() {
	const result = parseTodo({ input: exampleTodo });

	return (
		<MantineProvider theme={theme}>
			<Container py="xl" size="sm">
				<Stack gap="md">
					<Badge variant="light">React + Mantine</Badge>
					<Title order={1}>Frontend template</Title>
					<Text c="dimmed">
						This app consumes Mantine components through the workspace UI
						package.
					</Text>

					<Card withBorder>
						<Code block>
							{JSON.stringify(
								result.success
									? {
											...result.todo,
											createdAt: result.todo.createdAt.toLocaleString(),
											updatedAt:
												result.todo.updatedAt?.toLocaleString() ?? null,
										}
									: result.issues,
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
