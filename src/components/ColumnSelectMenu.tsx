'use client';

import { useBoard } from '../contexts/BoardContext';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';

export default function ColumnSelectMenu({ taskId }: { taskId: string | number | undefined }) {
    const { columns, tasks, setTasks } = useBoard();

    const activeTask = tasks.find((task) => task.id === taskId);

    const currentColumn = columns.find((col) => col.id === activeTask?.columnId) || null;

    const handleColumnChange = (newColumnId: string | number | undefined) => {
        if (newColumnId) {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, columnId: newColumnId } : task
                )
            );
        }
    };

    return (
        <Listbox
            value={currentColumn}
            onChange={(newColumn) => handleColumnChange(newColumn?.id)}
        >
            <div className="relative mt-2">
                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-600 py-1.5 pl-3 pr-2 text-left text-white sm:text-sm">
          <span className="col-start-1 row-start-1 truncate pr-6">
            {currentColumn ? currentColumn.title : 'Select a column'}
          </span>
                    <ChevronUpDownIcon
                        aria-hidden="true"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-white sm:size-4"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-600 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                >
                    {columns.map((column) => (
                        <ListboxOption
                            key={column.id}
                            value={column}
                            className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white data-[focus]:outline-none"
                        >
              <span className="block font-normal group-data-[selected]:font-semibold">
                {column.title}
              </span>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}
