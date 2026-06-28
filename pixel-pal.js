(() => {
    if (window.__pixelPalInit) {
        return;
    }
    window.__pixelPalInit = true;

    const size = 86;

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
        }
    `;
    document.head.appendChild(style);

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
                <li>Social, creative, and athletic</li>
                <li>Loves travel, sports, and friends</li>
                <li>Attending Phillips Exeter Academy</li>
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

    const onPalActivate = (event) => {
        event.preventDefault();
        event.stopPropagation();
        togglePanel();
    };

    pal.addEventListener("click", onPalActivate);
    pal.addEventListener("touchend", onPalActivate, { passive: false });
    if (closeBtn) {
        closeBtn.addEventListener("click", closePanel);
    }

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
        }
    });
})();
