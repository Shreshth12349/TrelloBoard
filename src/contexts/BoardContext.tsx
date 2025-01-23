import React, { createContext, useContext, useState, ReactNode } from "react";
import { Column, Task } from "../types.ts";

type BoardContextType = {
    columns: Column[];
    tasks: Task[];
    createNewColumn: () => void;
    createTask: (columnId: string | number) => void;
    deleteColumn: (id: string | number) => void;
    updateColumn: (id: string | number, newTitle: string) => void;
    deleteTask: (taskId: string | number | undefined) => void;
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
    const [columns, setColumns] = useState<Column[]>([
        {id: 1, title: 'Pending'},
        {id: 2, title: 'Ongoing'},
        {id: 3, title: 'Completed'}
        ]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const generateId = () => Math.floor(Math.random() * 10001);

    const createNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };
        setColumns([...columns, columnToAdd]);
    };

    const createTask = (columnId: string | number) => {
        setTasks([
            ...tasks,
            { id: generateId(), columnId, title: `Task ${tasks.length + 1}`, description: "Description" },
        ]);
    };

    const deleteColumn = (id: string | number) => {
        const filteredColumns = columns.filter((column) => column.id !== id);
        setTasks(tasks.filter((task) => task.columnId !== id));
        setColumns(filteredColumns);
    };

    const updateColumn = (id: string | number, newTitle: string) => {
        setColumns(
            columns.map((column) => {
                if (id === column.id) {
                    return { ...column, title: newTitle };
                }
                return column;
            })
        );
    };

    const deleteTask = (taskId: string | number | undefined) => {
        if (taskId) {
            setTasks(tasks.filter((task) => task.id !== taskId));
        }
    };

    return (
        <BoardContext.Provider
            value={{
                columns,
                tasks,
                createNewColumn,
                createTask,
                deleteColumn,
                updateColumn,
                deleteTask,
                setColumns,
                setTasks,
            }}
        >
            {children}
        </BoardContext.Provider>
    );
};

export const useBoard = (): BoardContextType => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error("useBoard must be used within a BoardProvider");
    }
    return context;
};
