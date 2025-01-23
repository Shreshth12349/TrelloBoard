import {Column, Task} from "../types.ts";
import {PlusIcon, TrashIcon} from "@heroicons/react/24/outline";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useState} from "react";
import TaskCard from "./TaskCard.tsx";

export default function ColumnContainer ({column, deleteColumn, updateColumn, createTask, tasks, deleteTask}: {column: Column, deleteColumn: (id: string | number) => void, updateColumn: (id: string | number, newTitle: string) => void, createTask: (columnId: string | number) => void, tasks: Task[], deleteTask: (taskId: string | number) => void}) {

    const [editMode, setEditMode] = useState(false)

    // const taskIds = useMemo(() => {
    //     return tasks.map(task => task.id)
    // }, [tasks])

    const {setNodeRef, attributes, listeners, transform, transition, isDragging} = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        },
        disabled: editMode
    })



    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return <div ref={setNodeRef} style={style} className={'bg-gray-900 w-[350px] ring-2 ring-rose-500 opacity-70 h-[500px] max-h-[500px] rounded-md flex flex-col '}></div>
    }




    return (
        <div ref={setNodeRef} style={style} className={'bg-gray-900 w-[350px]  h-[500px] max-h-[500px] rounded-md flex flex-col '}>
            <div
                {...attributes} {...listeners}
                onClick={() => setEditMode(true)}
                className={'text-center flex flex-row gap-4 items-center justify-between bg-black text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-gray-900 border-4'}>
                <div className={'flex gap-4 items-center'}>
                    <div className={'flex justify-center items-center bg-gray-800 px-2 py-1 text-sm rounded-full'}>{tasks.length}</div>
                    {!editMode && column.title}
                    {editMode && <input type={'text'} autoFocus={true} onBlur={() => setEditMode(false)} className={'bg-black focus:border-rose-500 border-opacity-70 border  rounded-sm outline-none px-2'} value={column.title} onChange={(e) => updateColumn(column.id, e.target.value)}/>}
                </div>
                <button  onClick={() => deleteColumn(column.id)}>
                    <TrashIcon className={'stroke-gray-600  h-6 w-6'} />
                </button>
            </div>
            <div className={'flex flex-grow flex-col gap-1 p-2 overflow-x-hidden overflow-y-auto'}>
                <SortableContext items={tasks}>
                    {tasks.map(task => (
                        <TaskCard deleteTask={deleteTask} key={task.id} task={task}/>
                    ))}
                </SortableContext>
            </div>
            <div className={'flex items-center justify-center'}>
                <button onClick={() => createTask(column.id)} className={'text-center bg-blue-900 bg-opacity-40 hover:text-rose-300 hover:bg-gray-800 p-1 transition-all active:scale-95 flex flex-row items-center justify-center gap-2 w-full m-1 rounded-md text'}>
                    <div>Add Task</div>
                    <PlusIcon className={'h-5 w-5 stroke-2'}/>
                </button>
            </div>
        </div>
    )
}
