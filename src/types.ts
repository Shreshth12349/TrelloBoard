export interface Column {
    id: string | number
    title: string
}

export interface Task {
    id: string | number
    columnId: string | number
    title: string
    description: string
}
