import userRoutes from "./user/user.routes";
import projectRoutes from "./project/project.routes";
import todoRoutes from "./todo/todo.routes";
import noteRoutes from "./note/note.routes";
import healthRoutes from "./health/health.routes";
import snippetRoutes from "./snippet/snippet.routes";
import searchRoutes from "./search/search.routes";
import summaryRoutes from "./summary/summary.routes";
import githubRoutes from "./github/github.routes";

const routes = {
	user: userRoutes,
	project: projectRoutes,
	todo: todoRoutes,
	note: noteRoutes,
	health: healthRoutes,
	snippet: snippetRoutes,
	search: searchRoutes,
	summary: summaryRoutes,
	github: githubRoutes,
};

export default routes;
