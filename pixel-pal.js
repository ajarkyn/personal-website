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
            pointer-events: none;
            z-index: 2000;
            filter: drop-shadow(0 6px 12px rgba(194, 24, 91, 0.28));
            opacity: 0.98;
        }

        .pixel-pal-sprite {
            width: 100%;
            height: 100%;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
        }

        @media (max-width: 768px) {
            .pixel-pal {
                width: 72px;
                height: 72px;
                right: 10px;
                bottom: 10px;
            }
        }
    `;
    document.head.appendChild(style);

    const pal = document.createElement("div");
    pal.className = "pixel-pal";
    pal.setAttribute("aria-hidden", "true");

    const sprite = document.createElement("canvas");
    sprite.className = "pixel-pal-sprite";
    sprite.width = 60;
    sprite.height = 60;
    pal.appendChild(sprite);
    document.body.appendChild(pal);

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
})();
