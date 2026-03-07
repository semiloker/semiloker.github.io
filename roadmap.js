function generateBar(percent, totalBlocks = 10) {
    const filled = Math.round((percent / 100) * totalBlocks);
    const empty = totalBlocks - filled;

    const bar =
        "█".repeat(filled) +
        "░".repeat(empty);

    return `[${bar}] ${percent}%`;
}

function updateRoadmapStats() {
    const nodes = document.querySelectorAll(".tree-subtask");

    let done = 0;
    let progress = 0;
    let planned = 0;

    nodes.forEach(node => {
        const status = node.dataset.status;

        if (status === "done") done++;
        else if (status === "progress") progress++;
        else planned++;
    });

    const total = nodes.length || 1;

    const donePercent = Math.round((done / total) * 100);
    const progressPercent = Math.round((progress / total) * 100);
    const plannedPercent = Math.round((planned / total) * 100);

    document.getElementById("stat-done").textContent =
        generateBar(donePercent);

    document.getElementById("stat-progress").textContent =
        generateBar(progressPercent);

    document.getElementById("stat-planned").textContent =
        generateBar(plannedPercent);
}

updateRoadmapStats();
