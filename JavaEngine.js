/* ==========================================================================
   MIKE'S CAREERTECH TOOLKIT: UNIVERSAL WIDGETS JS ENGINE
   Handles logic and rendering for headless widgets
   Thank you Mike Henson of University of Sunderland <3 :3
   ========================================================================== */

(function initCareerTechWidgets() {
    const container = document.getElementById("careertech-widget-container");
    if (!container) return;

    const data = window.widgetData || [];

    if (data.length === 0) {
        container.innerHTML = "<p style='color:red;'>Error: No widget data found.</p>";
        return;
    }

    // Always initialise roulette
    initRoulette(container, data);
})();
``
function initRoulette(container, skillDatabase) {
    container.innerHTML = `
        <div class="ct-app-container" id="ct-roulette-app">
            <div class="ct-header">
                <h2>Graduate Attribute Roulette</h2>
                <p>Spin to discover a core BSU attribute and skill!</p>
            </div>
            <div class="ct-roulette-screen" id="ct-screen">
                <span class="ct-category-tag" id="ct-attribute">Attribute</span>
                <div class="ct-verb-wrapper">
                    <h1 class="ct-verb-display" id="ct-skill">READY?</h1>
                </div>
                <div class="ct-example-box" id="ct-description-container">
                    <span class="ct-example-label">Skill Description:</span>
                    <p class="ct-example-text" id="ct-description">
                        Click spin to find the next great skill you've been developing whilst at BSU.
                    </p>
                </div>
            </div>
            <div class="ct-controls-box">
                <button class="ct-spin-btn" id="ct-spin-btn">🎰 Spin the Wheel</button>
            </div>
        </div>
    `;

    const skillDisplay = document.getElementById('ct-skill');
    const attributeTag = document.getElementById('ct-attribute');
    const descriptionText = document.getElementById('ct-description');
    const screen = document.getElementById('ct-screen');
    const spinBtn = document.getElementById('ct-spin-btn');

    let isSpinning = false;

    spinBtn.addEventListener('click', () => {
        if (isSpinning) return;

        isSpinning = true;
        spinBtn.disabled = true;
        spinBtn.innerText = "Spinning...";
        screen.classList.remove('ct-landed');
        screen.classList.add('ct-spinning');

        let spinCount = 0;
        const totalSpins = 20;
        const spinIntervalTime = 50;

        const spinInterval = setInterval(() => {
            const randomSkill =
                skillDatabase[Math.floor(Math.random() * skillDatabase.length)].skill;

            skillDisplay.innerText = randomSkill;
            spinCount++;

            if (spinCount >= totalSpins) {
                clearInterval(spinInterval);
                landOnSkill();
            }
        }, spinIntervalTime);
    });

    function landOnSkill() {
        const finalSelection =
            skillDatabase[Math.floor(Math.random() * skillDatabase.length)];

        skillDisplay.innerText = finalSelection.skill || 'SKILL';
        attributeTag.innerText = finalSelection.attribute || 'Attribute';
        descriptionText.innerText =
            '"' + (finalSelection.description || '...') + '"';

        screen.classList.remove('ct-spinning');
        setTimeout(() => {
            screen.classList.add('ct-landed');
        }, 50);

        spinBtn.disabled = false;
        spinBtn.innerText = "🎰 Spin Again";
        isSpinning = false;
    }
}
