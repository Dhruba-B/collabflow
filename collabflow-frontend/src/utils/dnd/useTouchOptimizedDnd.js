import { useEffect, useState } from "react";

const getTouchOptimizedDnd = () => {
    if (typeof window === "undefined" || !window.matchMedia) {
        return false;
    }

    return (
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(max-width: 768px)").matches
    );
};

const useTouchOptimizedDnd = () => {
    const [isTouchOptimized, setIsTouchOptimized] = useState(
        getTouchOptimizedDnd
    );

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) {
            return undefined;
        }

        const queries = [
            window.matchMedia("(pointer: coarse)"),
            window.matchMedia("(hover: none)"),
            window.matchMedia("(max-width: 768px)"),
        ];
        const updateTouchMode = () =>
            setIsTouchOptimized(getTouchOptimizedDnd());

        queries.forEach((query) => {
            query.addEventListener("change", updateTouchMode);
        });

        return () => {
            queries.forEach((query) => {
                query.removeEventListener("change", updateTouchMode);
            });
        };
    }, []);

    return isTouchOptimized;
};

export default useTouchOptimizedDnd;
