// Types and interfaces are in a single file for simplicity. For more complicated app it is better to break them down into separate files

export type Todo = {
    id: number;
    title: string;
    completed: boolean;
    color?: string;
}