import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/outline";
import {Task} from "../types.ts";
import {useState} from "react";
import EditTaskModal from "./EditTaskModal.tsx";

export default function TaskCard({ task, deleteTask }: { task: Task; deleteTask: (taskId: string | number) => void }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const [showIcons, setShowIcons] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTaskId, setEditTaskId] = useState<string | number | null>(null)


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (isDragging) {
        return <div style={style}  className={'bg-black p-2.5 h-[100px] border-rose-500 border cursor-grab min-h-[100px] flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500'} ></div>
    }

    const handleEditModal = () => {
        setShowEditModal(true)
        setEditTaskId(task.id)
    }


    return (
        <div
            ref={setNodeRef}
            style={style}
            onMouseEnter={() => setShowIcons(true)}
            onMouseLeave={() => setShowIcons(false)}
            {...attributes}
            {...listeners}
            className="bg-black p-2.5 h-[100px] cursor-grab flex min-h-[100px] text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500"
        >

            <div className={'flex-grow flex flex-col gap-1'}>
                <div className="flex text-sm font-bold">{task.title}</div>
                <div className="flex text-xs">{task.description}</div>
            </div>
            <div className={'flex flex-col justify-between'}>
                {showIcons && (
                    <>
                        <button onClick={() => deleteTask(task.id)}>
                            <TrashIcon className="h-5 w-5 stroke-gray-500 opacity-60 hover:opacity-100"/>
                        </button>
                        <button onClick={handleEditModal}>
                            <PencilIcon className="h-5 w-5 stroke-gray-500 opacity-60 hover:opacity-100"/>
                        </button>
                    </>
                )}
            </div>
            <EditTaskModal setOpen={setShowEditModal} open={showEditModal} editTaskId={editTaskId}/>
        </div>
    );
}
