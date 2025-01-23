import {PlusCircleIcon} from "@heroicons/react/16/solid";
import {useState} from "react";
import {Column, Task} from "../types.ts";
import ColumnContainer from "./ColumnContainer.tsx";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import TaskCard from "./TaskCard.tsx";

export default function ProjectsBoard () {

    const [columns, setColumns] = useState<Column[]>([])
    const [tasks, setTasks] = useState<Task[]>([])

    // const columnsId = useMemo(() => columns.map((col) => col.id), [columns])

    function generateId () {
        return Math.floor(Math.random() * 10001)
    }

    const createNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length+1}`
        }
        setColumns([...columns, columnToAdd])
        console.dir(columns)
    }

    const createTask = (columnId: string | number) => {
        setTasks([...tasks, {id: generateId(), columnId, content: `Task ${tasks.length+1}`}])
    }

    const deleteColumn = (id: string | number) => {
        const filteredColumns = columns.filter((column) => column.id !== id)
        setTasks(tasks.filter(task => task.columnId !== id))
        setColumns(filteredColumns)
    }

    const updateColumn = (id: string | number, newTitle: string)=>  {
        setColumns(columns.map(column => {
            if (id == column.id) {
                column.title = newTitle;
                return column;
            }
            return column
        }))
    }

    const deleteTask = (taskId: string | number) => {
        setTasks(tasks.filter(task => taskId !== task.id))
    }

    const [activeColumn, setActiveColumn] = useState<Column | null>()
    const [activeTask, setActiveTask] = useState<Task | null>()

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3
        }
    }))

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current?.column);
            setActiveTask(null); // Clear active task
        }
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current?.task);
            setActiveColumn(null); // Clear active column
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === "Column" && overType === "Column") {
            const activeColumnId = active.id;
            const overColumnId = over.id;

            if (activeColumnId !== overColumnId) {
                setColumns((columns) => {
                    const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
                    const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);
                    return arrayMove(columns, activeColumnIndex, overColumnIndex);
                });
            }
            return;
        }

        if (activeType === "Task" && (overType === "Task" || overType === "Column")) {
            const activeId = active.id;
            const overId = over.id;

            setTasks((tasks) => {
                const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);
                const isOverTask = overType === "Task";
                const overTaskIndex = isOverTask ? tasks.findIndex((task) => task.id === overId) : -1;

                if (isOverTask) {
                    tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
                    return arrayMove(tasks, activeTaskIndex, overTaskIndex);
                } else if (overType === "Column") {
                    tasks[activeTaskIndex].columnId = overId;
                }
                return tasks;
            });
        }
    };


    const onDragOver = (event: DragOverEvent) => {
        const {active, over} = event;
        if (!over) return
        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return

        const isActiveATask = active.data.current?.type === "Task"
        const isOverATask = over.data.current?.type === "Task"

        if (!isActiveATask) return;
        // If dropping a task over another task
        if (isActiveATask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === activeId)
                const overIndex = tasks.findIndex(t => t.id === overId)
                tasks[activeIndex].columnId = tasks[overIndex].columnId
                return arrayMove(tasks, activeIndex, overIndex)
            })
        }
        //If dropping a task over a column

        const isOverAColumn = over.data.current?.type === 'Column'
        if (isActiveATask && isOverAColumn) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex(t => t.id === activeId)
                tasks[activeIndex].columnId = overId
                return arrayMove(tasks, activeIndex, activeIndex)
            })
        }
    }
    return (
        <div className={'m-auto flex min-h-screen  w-full items-center overflow-x-auto overflow-y-hidden px-[40px]'}>
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className={'m-auto flex gap-4'}>
                    <div className={'flex gap-4'}>
                        <SortableContext items={columns}>
                            {columns.map(column => (
                                <ColumnContainer deleteTask={deleteTask} tasks={tasks.filter(task => task.columnId === column.id)} key={column.id} column={column} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask}/>
                            ))}
                        </SortableContext>
                    </div>
                    <button
                        onClick={createNewColumn}
                        className={'h-[60px] text-white w-[350px] flex flex-row items-center gap-4 min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2'}>
                        <PlusCircleIcon className={'h-8 w-8'}/>
                        <div>Add Column</div>
                    </button>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                deleteTask={deleteTask}
                                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                                key={activeColumn.id}
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                            />
                        )}
                        {activeTask && <TaskCard deleteTask={deleteTask} task={activeTask} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    )
}
