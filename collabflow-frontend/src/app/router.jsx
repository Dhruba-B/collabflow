import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/home/HomePage";
import { ThemeToggle } from "../components";
import useThemeStore from "../store/themeStore";
import DashboardPage from "../pages/dashboard/DashboardPage";
import WorkspacePage from "../pages/workspace/WorkspacePage";
import BoardPage from "../pages/board/BoardPage";

const Router = () => {
    const { mode, toggleTheme } = useThemeStore();
    return (
        <>
            <ThemeToggle mode={mode}
                onToggle={toggleTheme}
            />
            <Routes>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/workspace/:workspaceId" element={<WorkspacePage />} />
                <Route path="/workspace/:workspaceId/board/:boardId" element={<BoardPage />} />

                {/* <Route path="/" element={<div>Home</div>} /> */}
            </Routes>
        </>

    );
};

export default Router;
