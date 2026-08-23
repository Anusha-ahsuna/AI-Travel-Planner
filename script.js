document.addEventListener("DOMContentLoaded", () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-List');

    if (mobileMenu && navList) {
        const menuIcon = mobileMenu.querySelector('i');

        mobileMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
            
            // Toggle icon if present
            if (menuIcon) {
                if (navList.classList.contains('active')) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-xmark');
                } else {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });

        // Close menu on link click
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
            });
        });
    }
});
async function generatePlan() {

    const destination = document.getElementById("destination").value;
    const days = document.getElementById("days").value;
    const budget = document.getElementById("budget").value;
    const travelType = document.getElementById("travelType").value;
    const activity = document.getElementById("activity").value;

    const output = document.getElementById("output");

    output.innerHTML = `<div class="loading">
        <i class="fas fa-plane"></i>
        <h3>Creating your travel plan...</h3>
        <p>Finding places, activities and travel tips...</p>
    </div>`;

    try {

        const response = await fetch("/api/generate-trip", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                destination,
                days,
                budget,
                travelType,
                activity
            })

        });

        const data = await response.json();

console.log("Server Response:", data);

if (data.plan) {
    output.innerHTML = data.plan;
} else {
    output.innerHTML = `<h3>${data.error || "No itinerary received from server."}</h3>`;
}

    }
   catch (error) {

    console.error("Gemini Error:", error);

    output.innerHTML = `
        <h3>Something went wrong</h3>
        <p>Please try again.</p>
    `;
}
}

