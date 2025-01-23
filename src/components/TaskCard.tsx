import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import {TrashIcon} from "@heroicons/react/24/outline";
import {Task} from "../types.ts";

export default function TaskCard({ task, deleteTask }: { task: Task; deleteTask: (taskId: string | number) => void }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (isDragging) {
        return <div style={style}  className={'bg-black p-2.5 h-[100px] border-rose-500 border cursor-grab min-h-[100px] flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500'} ></div>
    }


    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-black p-2.5 h-[100px] cursor-grab flex min-h-[100px] text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500"
        >
            <div className="flex-grow">{task.content}</div>
            <button onClick={() => deleteTask(task.id)}>
                <TrashIcon className="h-5 w-5 stroke-gray-500 opacity-60 hover:opacity-100" />
            </button>
        </div>
    );
}
