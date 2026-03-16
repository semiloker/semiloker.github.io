const tooltip = document.createElement("div");
tooltip.className = "node-tooltip";
document.body.appendChild(tooltip);

document.querySelectorAll(".tree-subtask").forEach(subtask => {

    subtask.addEventListener("mouseenter", () => {

        const title = subtask.textContent.replace("|-", "").trim();
        const status = subtask.dataset.status || "unknown";
        const notes = subtask.dataset.description || "—";

        const parentTask = subtask.closest(".tree-task");
        const depends = parentTask
            ? parentTask.firstChild.textContent.trim()
            : "—";

        tooltip.innerHTML = `
            <div class="tooltip-title">${title}</div>

            <div class="tooltip-row">
                <span class="tooltip-label">Status:</span>
                <span>${status}</span>
            </div>

            <div class="tooltip-row">
                <span class="tooltip-label">Depends:</span>
                <span>${depends}</span>
            </div>

            <div class="tooltip-divider"></div>

            <div class="tooltip-row">
                <span class="tooltip-label">Notes:</span>
            </div>

            <div class="tooltip-notes">${notes}</div>
        `;

        tooltip.classList.add("show");
    });

    subtask.addEventListener("mousemove", e => {
        tooltip.style.left = e.clientX + 18 + "px";
        tooltip.style.top = e.clientY + 18 + "px";
    });

    subtask.addEventListener("mouseleave", () => {
        tooltip.classList.remove("show");
    });

});
