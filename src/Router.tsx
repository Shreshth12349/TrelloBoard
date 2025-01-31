import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProjectsPage from "./pages/ProjectsPage.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProjectsPage/>
    },
])

export function Router() {
    return <RouterProvider router={router} />;
}



