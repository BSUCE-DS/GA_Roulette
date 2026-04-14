/* ==========================================================================
   MIKE'S CAREERTECH TOOLKIT: UNIVERSAL WIDGETS JS ENGINE
   Handles logic and rendering for headless widgets
   ========================================================================== */

// Runs immediately instead of waiting for DOMContentLoaded
(function initCareerTechWidgets() {
    const container = document.getElementById("careertech-widget-container");
    if (!container) return;

    const type = container.getAttribute("data-widget-type");
    const data = window.widgetData || [];

    if (data.length === 0) {
        container.innerHTML = "<p style='color:red;'>Error: No widget data found.</p>";
        return;
    }

    if (type === "flashcards") initFlashcards(container, data);
    else if (type === "roulette") initRoulette(container, data);
    else if (type === "mythbuster") initMythbuster(container, data);
    else if (type === "dosanddonts") initDosAndDonts(container, data);
})();

/* --- 1. Flashcards Engine --- */
function initFlashcards(container, deck) {
    let currentIndex = 0;

    container.innerHTML = `
        <div class="ct-flashcard-wrapper">
            <div class="ct-scene" id="ct-scene">
                <div class="ct-card" id="ct-flashcard">
                    <div class="ct-card-face ct-card-face--front">
                        <div class="ct-question-tag" id="ct-card-tag">Loading</div>
                        <p class="ct-question-text" id="ct-card-question">Loading...</p>
                        <div class="ct-flip-hint">ðŸ‘† Tap to flip</div>
                    </div>
                    <div class="ct-card-face ct-card-face--back">
                        <div class="ct-back-title">STAR(R) Structure Example</div>
                        <div id="ct-star-breakdown"></div>
                    </div>
                </div>
            </div>
            <div class="ct-controls">
                <button class="ct-btn-outline" id="ct-btn-prev">â† Previous</button>
                <div class="ct-counter" id="ct-card-counter"></div>
                <button class="ct-btn-outline" id="ct-btn-next">Next â†’</button>
            </div>
        </div>
    `;

    const cardElement = document.getElementById('ct-flashcard');
    document.getElementById('ct-scene').addEventListener('click', () => cardElement.classList.toggle('is-flipped'));

    function loadCard(index) {
        if(deck.length === 0) return;
        const data = deck[index];
        document.getElementById('ct-card-tag').innerText = data.tag || 'Topic';
        document.getElementById('ct-card-question').innerText = data.question || '...';
        
        let breakdownHtml = '';
        const labels = ['Situation', 'Task', 'Action', 'Result', 'Reflection'];
        const letters = ['S', 'T', 'A', 'R', 'R'];
        const values = [data.s, data.t, data.a, data.r, data.r2];
        
        for(let i=0; i<5; i++) {
            if(values[i]) {
                breakdownHtml += '<div class="ct-star-item"><div class="ct-star-letter">' + letters[i] + '</div><div class="ct-star-content"><strong>' + labels[i] + '</strong><span>' + values[i] + '</span></div></div>';
            }
        }
        document.getElementById('ct-star-breakdown').innerHTML = breakdownHtml;
        document.getElementById('ct-card-counter').innerText = (index + 1) + " / " + deck.length;
        document.getElementById('ct-btn-prev').disabled = index === 0;
        document.getElementById('ct-btn-next').disabled = index === deck.length - 1;
    }

    function changeCard(direction) {
        if (cardElement.classList.contains('is-flipped')) {
            cardElement.classList.remove('is-flipped');
            setTimeout(() => { currentIndex += direction; loadCard(currentIndex); }, 300); 
        } else {
            currentIndex += direction;
            loadCard(currentIndex);
        }
    }

    document.getElementById('ct-btn-prev').addEventListener('click', () => changeCard(-1));
    document.getElementById('ct-btn-next').addEventListener('click', () => changeCard(1));

    loadCard(0);
}

/* --- 2. Verb Roulette Engine --- */
function initRoulette(container, verbDatabase) {
    container.innerHTML = `
        <div class="ct-app-container" id="ct-roulette-app">
            <div class="ct-header">
                <h2>Action Verb Roulette</h2>
                <p>Spin for high-impact CV alternatives!</p>
            </div>
            <div class="ct-roulette-screen" id="ct-screen">
                <span class="ct-category-tag" id="ct-category">Category</span>
                <div class="ct-verb-wrapper"><h1 class="ct-verb-display" id="ct-verb">READY?</h1></div>
                <div class="ct-example-box" id="ct-example-container">
                    <span class="ct-example-label">Example Bullet Point:</span>
                    <p class="ct-example-text" id="ct-example">Click spin to find your next great bullet point.</p>
                </div>
            </div>
            <div class="ct-controls-box">
                <button class="ct-spin-btn" id="ct-spin-btn">ðŸŽ° Spin the Wheel</button>
            </div>
        </div>
    `;

    const verbDisplay = document.getElementById('ct-verb');
    const categoryTag = document.getElementById('ct-category');
    const exampleText = document.getElementById('ct-example');
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
            const randomVerb = verbDatabase[Math.floor(Math.random() * verbDatabase.length)].verb;
            verbDisplay.innerText = randomVerb;
            spinCount++;
            if (spinCount >= totalSpins) {
                clearInterval(spinInterval);
                landOnVerb();
            }
        }, spinIntervalTime);
    });

    function landOnVerb() {
        const finalSelection = verbDatabase[Math.floor(Math.random() * verbDatabase.length)];
        verbDisplay.innerText = finalSelection.verb || 'VERB';
        categoryTag.innerText = finalSelection.category || 'Category';
        exampleText.innerText = '"' + (finalSelection.example || '...') + '"';
        screen.classList.remove('ct-spinning');
        setTimeout(() => { screen.classList.add('ct-landed'); }, 50);
        spinBtn.disabled = false;
        spinBtn.innerText = "ðŸŽ° Spin Again";
        isSpinning = false;
    }
}

/* --- 3. Mythbuster Engine --- */
function initMythbuster(container, quizData) {
    container.innerHTML = `
        <div class="ct-progress-text" id="ct-progress">Question 1 of X</div>
        <div class="ct-myth-card" id="ct-quiz-card">
            <p class="ct-statement" id="ct-statement">Loading...</p>
            <div class="ct-actions">
                <button class="ct-btn ct-btn-myth" id="ct-btn-myth">âŒ MYTH</button>
                <button class="ct-btn ct-btn-fact" id="ct-btn-fact">âœ… FACT</button>
            </div>
            <div class="ct-result-overlay" id="ct-result-overlay">
                <div class="ct-result-badge" id="ct-result-badge">Correct!</div>
                <p class="ct-explanation" id="ct-explanation">Explanation goes here.</p>
                <button class="ct-next-btn" id="ct-next-btn">Next Question âž”</button>
            </div>
        </div>
        <div class="ct-end-screen" id="ct-end-screen">
            <h2 style="margin-top:0; color:var(--bg-text);">Quiz Complete! ðŸŽ‰</h2>
            <p style="color:var(--bg-text);">You've busted the myths and learned the facts.</p>
            <button class="ct-next-btn" onclick="location.reload()" style="margin-top:15px;">Start Over</button>
        </div>
    `;

    let currentIndex = 0;

    function loadQuestion() {
        if(currentIndex >= quizData.length) {
            document.getElementById('ct-quiz-card').style.display = 'none';
            document.getElementById('ct-progress').style.display = 'none';
            document.getElementById('ct-end-screen').style.display = 'block';
            return;
        }
        document.getElementById('ct-statement').innerText = quizData[currentIndex].statement || '...';
        document.getElementById('ct-progress').innerText = "Question " + (currentIndex + 1) + " of " + quizData.length;
        document.getElementById('ct-result-overlay').classList.remove('active');
    }

    function checkAnswer(userChoice) {
        const currentQ = quizData[currentIndex];
        const isCorrect = userChoice === currentQ.answer;
        
        const badge = document.getElementById('ct-result-badge');
        if(isCorrect) {
            badge.innerText = "Correct!";
            badge.className = "ct-result-badge ct-correct-badge";
        } else {
            badge.innerText = "Actually, it's a " + currentQ.answer.toUpperCase();
            badge.className = "ct-result-badge ct-incorrect-badge";
        }
        
        document.getElementById('ct-explanation').innerText = currentQ.explanation || '';
        document.getElementById('ct-result-overlay').classList.add('active');
    }

    document.getElementById('ct-btn-myth').addEventListener('click', () => checkAnswer('myth'));
    document.getElementById('ct-btn-fact').addEventListener('click', () => checkAnswer('fact'));
    document.getElementById('ct-next-btn').addEventListener('click', () => {
        currentIndex++;
        loadQuestion();
    });

    loadQuestion();
}

/* --- 4. Do's and Don'ts Engine --- */
function initDosAndDonts(container, gridData) {
    container.innerHTML = `
        <div class="ct-dd-header">
            <h2>Do's & Don'ts</h2>
            <p>Click the cards below to reveal if the statement is a good practice or a common mistake.</p>
        </div>
        <div class="ct-grid" id="ct-grid"></div>
    `;

    const gridContainer = document.getElementById('ct-grid');

    gridData.forEach((item) => {
        const isDo = item.type === 'do';
        const bgClass = isDo ? 'do-card' : 'dont-card';
        const icon = isDo ? "âœ… DO" : "âŒ DON'T";
        
        const tile = document.createElement('div');
        tile.className = 'ct-tile';
        tile.onclick = function() { this.classList.toggle('flipped'); };
        
        // Removed the rogue backslashes here so JS evaluates the variables properly!
        tile.innerHTML = `
            <div class="ct-tile-inner">
                <div class="ct-tile-face ct-tile-front">
                    <p>${item.statement}</p>
                    <div class="ct-click-hint">Tap to Reveal</div>
                </div>
                <div class="ct-tile-face ct-tile-back ${bgClass}">
                    <div class="ct-status-icon">${icon}</div>
                    <p>${item.explanation}</p>
                </div>
            </div>
        `;
        gridContainer.appendChild(tile);
    });
}
