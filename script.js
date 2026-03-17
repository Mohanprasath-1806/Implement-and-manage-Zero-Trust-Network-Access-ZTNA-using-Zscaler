// Shared site interactions: mobile navigation, reveal animations, and the demo simulation.
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const siteNav = document.querySelector(".site-nav");

    if (navToggle && siteNav) {
        navToggle.addEventListener("click", () => {
            const isOpen = siteNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && revealItems.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.18,
            }
        );

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    // Demo page simulation logic.
    const runButton = document.getElementById("runSimulation");
    const resetButton = document.getElementById("resetSimulation");
    const demoStatus = document.getElementById("demoStatus");
    const demoLog = document.getElementById("demoLog");
    const demoNodes = Array.from(document.querySelectorAll(".demo-node"));

    const simulationSteps = [
        "User access request received from the endpoint.",
        "Identity Provider validates the user and applies MFA.",
        "Policy Engine checks role, device posture, and session context.",
        "Zscaler brokers a secure path to the approved private application.",
        "Application access granted with least-privilege scope.",
    ];

    let simulationRunning = false;

    const appendLog = (message) => {
        if (!demoLog) {
            return;
        }

        const item = document.createElement("li");
        item.textContent = message;
        demoLog.appendChild(item);
    };

    const resetSimulation = () => {
        demoNodes.forEach((node) => {
            node.classList.remove("active", "complete");
        });

        if (demoLog) {
            demoLog.innerHTML = "";
            appendLog("Waiting for a user access request.");
        }

        if (demoStatus) {
            demoStatus.textContent = "Ready to validate the session.";
        }

        simulationRunning = false;
    };

    const runSimulation = async () => {
        if (simulationRunning || demoNodes.length === 0) {
            return;
        }

        simulationRunning = true;
        resetSimulation();
        simulationRunning = true;

        for (const [index, message] of simulationSteps.entries()) {
            const currentNode = demoNodes[index];

            if (currentNode) {
                currentNode.classList.add("active");
            }

            if (demoStatus) {
                demoStatus.textContent = message;
            }

            appendLog(message);
            await new Promise((resolve) => window.setTimeout(resolve, 900));

            if (currentNode) {
                currentNode.classList.remove("active");
                currentNode.classList.add("complete");
            }
        }

        if (demoStatus) {
            demoStatus.textContent = "Simulation complete. The private application is available through brokered Zero Trust access.";
        }

        appendLog("Session completed with monitoring and audit visibility enabled.");
        simulationRunning = false;
    };

    if (runButton) {
        runButton.addEventListener("click", runSimulation);
    }

    if (resetButton) {
        resetButton.addEventListener("click", resetSimulation);
    }
});