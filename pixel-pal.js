(() => {
    if (window.__pixelPalInit) {
        return;
    }
    window.__pixelPalInit = true;

    const size = 86;
    const editorPasswordKey = "siteEditorPassword";
    const defaultEditorPassword = "editme123";
    const editorSessionKey = "siteEditorUnlocked";

    const style = document.createElement("style");
    style.textContent = `
        .pixel-pal {
            position: fixed;
            right: 16px;
            bottom: 16px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: auto;
            z-index: 99999;
            filter: drop-shadow(0 6px 12px rgba(194, 24, 91, 0.28));
            opacity: 0.98;
            background: transparent;
            border: 0;
            padding: 0;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
        }

        .pixel-pal-sprite {
            width: 100%;
            height: 100%;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
        }

        .nav-menu {
            padding-right: 58px;
        }

        .nav-lock-btn {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            border: 0;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.35);
            color: #FFFFFF;
            cursor: pointer;
        }

        .nav-lock-btn:hover {
            background: rgba(255, 255, 255, 0.55);
        }

        .site-editor-toolbar {
            position: fixed;
            top: 74px;
            right: 14px;
            z-index: 100001;
            background: #FFFFFF;
            border: 2px solid #FFB6D9;
            border-radius: 12px;
            box-shadow: 0 8px 22px rgba(194, 24, 91, 0.2);
            padding: 10px;
            display: none;
            gap: 8px;
            align-items: center;
        }

        .site-editor-toolbar.open {
            display: flex;
        }

        .site-editor-label {
            color: #C2185B;
            font-size: 0.86rem;
            font-weight: 600;
            margin-right: 4px;
            white-space: nowrap;
        }

        .site-editor-btn {
            border: 0;
            border-radius: 8px;
            padding: 7px 10px;
            background: #FF69B4;
            color: #FFFFFF;
            font-weight: 600;
            cursor: pointer;
        }

        .site-editor-btn.secondary {
            background: #C2185B;
        }

        .site-edit-target {
            outline: 2px dashed rgba(255, 105, 180, 0.5);
            outline-offset: 2px;
        }

        .quick-stats-panel {
            position: fixed;
            right: 20px;
            bottom: ${size + 32}px;
            width: min(92vw, 320px);
            background: #FFFFFF;
            color: #C2185B;
            border: 2px solid #FFB6D9;
            border-radius: 14px;
            box-shadow: 0 16px 30px rgba(194, 24, 91, 0.22);
            z-index: 100000;
            display: none;
        }

        .quick-stats-panel.open {
            display: block;
        }

        .quick-stats-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            border-bottom: 1px solid #FFD4E8;
            background: linear-gradient(135deg, #FFF4FA 0%, #FFF9D6 100%);
            border-radius: 12px 12px 0 0;
        }

        .quick-stats-header h2 {
            margin: 0;
            font-size: 1.05rem;
            color: #E91E63;
        }

        .quick-stats-close {
            border: 0;
            background: #FF69B4;
            color: #FFFFFF;
            width: 28px;
            height: 28px;
            border-radius: 999px;
            font-size: 1rem;
            line-height: 1;
            cursor: pointer;
        }

        .quick-stats-body {
            padding: 12px 16px 14px;
        }

        .quick-stats-list {
            margin: 0;
            padding-left: 20px;
        }

        .quick-stats-list li {
            margin-bottom: 6px;
            line-height: 1.5;
            color: #C2185B;
        }

        @media (max-width: 768px) {
            .pixel-pal {
                width: 72px;
                height: 72px;
                right: 10px;
                bottom: 10px;
            }

            .quick-stats-panel {
                right: 10px;
                bottom: 92px;
            }

            .site-editor-toolbar {
                right: 10px;
                top: 112px;
                left: 10px;
                justify-content: space-between;
            }

            .site-editor-label {
                font-size: 0.8rem;
            }
        }
    `;
    document.head.appendChild(style);

    const navMenu = document.querySelector(".nav-menu");
    const lockBtn = document.createElement("button");
    lockBtn.className = "nav-lock-btn";
    lockBtn.type = "button";
    lockBtn.setAttribute("aria-label", "Unlock site editor");
    lockBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-6 7.73V18a1 1 0 1 0 2 0v-1.27a2 2 0 1 0-2 0ZM10 9V7a2 2 0 1 1 4 0v2h-4Z"/></svg>`;
    if (navMenu && !navMenu.querySelector(".nav-lock-btn")) {
        navMenu.appendChild(lockBtn);
    }

    const editorBar = document.createElement("div");
    editorBar.className = "site-editor-toolbar";
    editorBar.innerHTML = `
        <span class="site-editor-label">Edit Mode Enabled</span>
        <button type="button" class="site-editor-btn" data-action="save">Save Page</button>
        <button type="button" class="site-editor-btn secondary" data-action="exit">Exit</button>
    `;
    document.body.appendChild(editorBar);

    const pal = document.createElement("button");
    pal.className = "pixel-pal";
    pal.type = "button";
    pal.setAttribute("aria-label", "Open Quick Stats");
    pal.setAttribute("aria-expanded", "false");

    const sprite = document.createElement("canvas");
    sprite.className = "pixel-pal-sprite";
    sprite.width = 60;
    sprite.height = 60;
    pal.appendChild(sprite);
    document.body.appendChild(pal);

    const panel = document.createElement("section");
    panel.className = "quick-stats-panel";
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = `
        <div class="quick-stats-header">
            <h2>Quick Stats</h2>
            <button type="button" class="quick-stats-close" aria-label="Close Quick Stats">×</button>
        </div>
        <div class="quick-stats-body">
            <ul class="quick-stats-list">
                <li>Weighted GPA: 4.7</li>
                <li>Sports: Swimming and volleyball</li>
                <li>Clubs: French Honor Society, Psychology Club, HOSA, Red Cross, Pen Pal Club</li>
                <li>Dream school: Stanford University</li>
            </ul>
        </div>
    `;
    document.body.appendChild(panel);

    const ctx = sprite.getContext("2d");
    if (!ctx) {
        return;
    }

    const drawCharacter = () => {
        const unit = 3;
        const skin = "#F4C7A8";
        const hairDark = "#4A2C21";
        const hairLight = "#6B3F2B";
        const eye = "#5A382C";
        const pink = "#FF69B4";
        const pinkDark = "#E956A4";

        const block = (x, y, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x * unit, y * unit, w * unit, h * unit);
        };

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, sprite.width, sprite.height);

        ctx.fillStyle = "rgba(194, 24, 91, 0.16)";
        ctx.beginPath();
        ctx.ellipse(30, 56, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        /* Medium-long curly brown hair with layered curls around the head and shoulders */
        block(6, 2, 8, 2, hairDark);
        block(5, 3, 10, 1, hairLight);
        block(4, 4, 2, 1, hairDark);
        block(14, 4, 2, 1, hairDark);
        block(4, 5, 2, 2, hairLight);
        block(14, 5, 2, 2, hairLight);
        block(4, 7, 2, 2, hairDark);
        block(14, 7, 2, 2, hairDark);
        block(4, 9, 2, 2, hairLight);
        block(14, 9, 2, 2, hairLight);
        block(5, 11, 2, 2, hairDark);
        block(13, 11, 2, 2, hairDark);
        block(6, 12, 1, 2, hairLight);
        block(13, 12, 1, 2, hairLight);

        block(7, 4, 6, 6, skin);
        block(9, 5, 2, 1, "#F9D8BE");

        block(8, 6, 1, 1, eye);
        block(11, 6, 1, 1, eye);
        block(8, 8, 1, 1, "#9C5B43");
        block(11, 8, 1, 1, "#9C5B43");
        block(9, 9, 2, 1, "#9C5B43");

        block(7, 10, 6, 1, "#EFBFA0");
        block(6, 11, 8, 1, pink);
        block(5, 12, 10, 3, pink);
        block(8, 12, 4, 3, pinkDark);

        block(4, 12, 1, 3, skin);
        block(15, 12, 1, 3, skin);

        block(6, 15, 8, 1, pink);
        block(6, 16, 3, 2, pinkDark);
        block(11, 16, 3, 2, pinkDark);
        block(7, 18, 2, 1, "#FFFFFF");
        block(11, 18, 2, 1, "#FFFFFF");
    };

    drawCharacter();

    const closeBtn = panel.querySelector(".quick-stats-close");

    const togglePanel = () => {
        const isOpen = panel.classList.toggle("open");
        panel.setAttribute("aria-hidden", String(!isOpen));
        pal.setAttribute("aria-expanded", String(isOpen));
    };

    const closePanel = () => {
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
        pal.setAttribute("aria-expanded", "false");
    };

    const editableSelector = "h1, h2, h3, p, li, figcaption";
    let isEditMode = false;

    const getEditorPassword = () => localStorage.getItem(editorPasswordKey) || defaultEditorPassword;

    const setImageEditState = (enabled) => {
        document.querySelectorAll("img").forEach((img) => {
            if (img.closest(".pixel-pal") || img.closest(".quick-stats-panel") || img.closest(".nav-menu")) {
                return;
            }
            img.style.cursor = enabled ? "crosshair" : "";
            img.setAttribute("title", enabled ? "Click to change image path" : "");
        });
    };

    const setEditMode = (enabled) => {
        isEditMode = enabled;
        document.querySelectorAll(editableSelector).forEach((node) => {
            if (node.closest(".nav-menu") || node.closest(".site-editor-toolbar") || node.closest(".quick-stats-panel")) {
                return;
            }
            if (enabled) {
                node.setAttribute("contenteditable", "true");
                node.classList.add("site-edit-target");
            } else {
                node.removeAttribute("contenteditable");
                node.classList.remove("site-edit-target");
            }
        });
        setImageEditState(enabled);
        editorBar.classList.toggle("open", enabled);
        lockBtn.style.background = enabled ? "rgba(255, 255, 255, 0.65)" : "rgba(255, 255, 255, 0.35)";
    };

    const serializeCurrentPage = () => {
        const clone = document.documentElement.cloneNode(true);
        clone.querySelectorAll("[contenteditable]").forEach((el) => el.removeAttribute("contenteditable"));
        clone.querySelectorAll(".site-edit-target").forEach((el) => el.classList.remove("site-edit-target"));
        clone.querySelectorAll(".site-editor-toolbar").forEach((el) => el.remove());
        clone.querySelectorAll(".quick-stats-panel.open").forEach((el) => el.classList.remove("open"));
        return "<!DOCTYPE html>\n" + clone.outerHTML;
    };

    const downloadCurrentPage = () => {
        const html = serializeCurrentPage();
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const link = document.createElement("a");
        const fileName = (window.location.pathname.split("/").pop() || "index.html").trim() || "index.html";
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
    };

    const ensurePassword = () => {
        if (localStorage.getItem(editorPasswordKey)) {
            return true;
        }
        const firstPassword = window.prompt("Create an editor password (first time setup):", "");
        if (!firstPassword) {
            return false;
        }
        localStorage.setItem(editorPasswordKey, firstPassword);
        return true;
    };

    const authenticateEditor = () => {
        if (!ensurePassword()) {
            return false;
        }
        const input = window.prompt("Enter editor password:", "");
        if (input !== getEditorPassword()) {
            window.alert("Incorrect password.");
            return false;
        }
        sessionStorage.setItem(editorSessionKey, "1");
        return true;
    };

    const handleImageEditClick = (event) => {
        if (!isEditMode) {
            return;
        }
        const target = event.target;
        if (!(target instanceof HTMLImageElement)) {
            return;
        }
        if (target.closest(".nav-menu") || target.closest(".pixel-pal") || target.closest(".quick-stats-panel") || target.closest(".site-editor-toolbar")) {
            return;
        }
        event.preventDefault();
        const currentSrc = target.getAttribute("src") || "";
        const nextSrc = window.prompt("Enter a new image path or URL:", currentSrc);
        if (nextSrc && nextSrc.trim()) {
            target.setAttribute("src", nextSrc.trim());
        }
    };

    const onPalActivate = (event) => {
        event.preventDefault();
        event.stopPropagation();
        togglePanel();
    };

    const onLockClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const unlocked = sessionStorage.getItem(editorSessionKey) === "1";
        if (!unlocked && !authenticateEditor()) {
            return;
        }
        setEditMode(!isEditMode);
    };

    pal.addEventListener("click", onPalActivate);
    pal.addEventListener("touchend", onPalActivate, { passive: false });
    lockBtn.addEventListener("click", onLockClick);
    lockBtn.addEventListener("touchend", onLockClick, { passive: false });
    if (closeBtn) {
        closeBtn.addEventListener("click", closePanel);
    }

    editorBar.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const action = target.getAttribute("data-action");
        if (action === "save") {
            downloadCurrentPage();
            return;
        }
        if (action === "exit") {
            setEditMode(false);
        }
    });

    document.addEventListener("click", handleImageEditClick, true);

    document.addEventListener("click", (event) => {
        if (!panel.classList.contains("open")) {
            return;
        }
        const target = event.target;
        if (!(target instanceof Node)) {
            return;
        }
        if (!panel.contains(target) && !pal.contains(target)) {
            closePanel();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closePanel();
            if (isEditMode) {
                setEditMode(false);
            }
        }
    });

    if (sessionStorage.getItem(editorSessionKey) === "1") {
        setEditMode(true);
    }
})();
