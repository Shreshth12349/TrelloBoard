import ProjectsBoard from "../components/ProjectsBoard.tsx";
import {BoardProvider} from "../contexts/BoardContext.tsx";

export default function ProjectsPage () {
    return (
        <div>
            <BoardProvider>
                <ProjectsBoard/>
            </BoardProvider>
        </div>
    )
}
