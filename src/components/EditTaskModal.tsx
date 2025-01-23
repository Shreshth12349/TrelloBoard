import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useBoard } from "../contexts/BoardContext.tsx";
import ColumnSelectMenu from "./ColumnSelectMenu.tsx";
import {TrashIcon} from "@heroicons/react/24/outline";

export default function EditTaskModal({
                                          open,
                                          setOpen,
                                          editTaskId,
                                      }: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    open: boolean;
    editTaskId: string | number | null;
}) {
    const { tasks, setTasks, deleteTask } = useBoard();

    const activeTask = tasks.find((task) => task.id === editTaskId);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === editTaskId ? { ...task, title: newTitle } : task
            )
        );
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newDescription = e.target.value;
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === editTaskId ? { ...task, description: newDescription } : task
            )
        );
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-900/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className={'flex flex-row items-center mb-4'}>
                            <div className="text-xl font-semibold text-white flex-grow">Edit Task</div>
                            <ColumnSelectMenu taskId={activeTask?.id}/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={activeTask?.title || ''}
                                onChange={handleTitleChange}
                                className="w-full rounded-lg bg-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={activeTask?.description || ''}
                                onChange={handleDescriptionChange}
                                className="w-full rounded-lg bg-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-between items-end">
                            <button onClick={() => deleteTask(activeTask?.id)}>
                                <TrashIcon className={'h-6 w-6 stroke-gray-400'}/>
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                            >
                                Save
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
