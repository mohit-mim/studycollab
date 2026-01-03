// Additional view toggle initialization for code editor page
(function () {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodeEditorViewToggle);
    } else {
        initCodeEditorViewToggle();
    }

    function initCodeEditorViewToggle() {
        // Only run on code editor page
        if (!document.getElementById('editor')) return;

        const desktopViewBtn = document.getElementById("desktop-view-btn");
        const mobileViewBtn = document.getElementById("mobile-view-btn");
        const editorWorkspace = document.querySelector(".editor-workspace");

        if (desktopViewBtn && mobileViewBtn && editorWorkspace) {
            console.log("[View Toggle] Initializing desktop/mobile view buttons for code editor");

            desktopViewBtn.addEventListener("click", () => {
                console.log("[View Toggle] Switching to desktop view");
                editorWorkspace.style.maxWidth = "none";
                editorWorkspace.style.margin = "auto";
                desktopViewBtn.classList.add("active");
                mobileViewBtn.classList.remove("active");
                localStorage.setItem("editorViewMode", "desktop");
                if (typeof showNotification === 'function') {
                    showNotification("Desktop view activated");
                }
            });

            mobileViewBtn.addEventListener("click", () => {
                console.log("[View Toggle] Switching to mobile view");
                editorWorkspace.style.maxWidth = "420px";
                editorWorkspace.style.margin = "0 auto";
                mobileViewBtn.classList.add("active");
                desktopViewBtn.classList.remove("active");
                localStorage.setItem("editorViewMode", "mobile");
                if (typeof showNotification === 'function') {
                    showNotification("Mobile view activated (420px)");
                }
            });

            // Restore previous view mode
            const savedViewMode = localStorage.getItem("editorViewMode");
            if (savedViewMode === "mobile") {
                setTimeout(() => mobileViewBtn.click(), 100);
            }
        }
    }
})();
