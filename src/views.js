// Function to show selected view
export function showView(view) {
    // Hide all views
    Array.from(container.children).forEach((child) => {
        child.style.display = "none";
    });

    // show selected view
    const selectedView = document.getElementById(view);
    if (selectedView) {
        selectedView.style.display = "block";
    }
}

// Handle browser back/forward button clicks
export function handlePopState(defaultView) {
    window.addEventListener("popstate", function (event) {
        const fragment = window.location.hash.substring(1);
        showView(fragment || defaultView);
    });
}
