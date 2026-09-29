/* =========================================
   PAGERANK LAB
   ========================================= */


/* ---------- GAME STATE ---------- */

let score = 0;

let round = 0;


/*
    Our four-page web.

    A → B
    A → C
    B → A
    B → D
    C → A
    D → C
*/

let links = [
    ["A", "B"],
    ["A", "C"],
    ["B", "A"],
    ["B", "D"],
    ["C", "A"],
    ["D", "C"]
];


/* Starting PageRank */

let pageScores = {

    A: 0.25,
    B: 0.25,
    C: 0.25,
    D: 0.25

};


/* ---------- PAGE POSITIONS ---------- */

const positions = {

    A: [150, 100],

    B: [550, 100],

    C: [150, 300],

    D: [550, 300]

};


/* ---------- SVG ---------- */

const svg =
    document.getElementById("networkSVG");


/* ---------- DRAW NETWORK ---------- */

function drawNetwork() {

    svg.innerHTML = "";


    /* Draw links */

    links.forEach(link => {

        const from = link[0];

        const to = link[1];

        const x1 = positions[from][0];

        const y1 = positions[from][1];

        const x2 = positions[to][0];

        const y2 = positions[to][1];


        const line =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );


        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);

        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);

        line.setAttribute(
            "class",
            "link"
        );


        svg.appendChild(line);

    });


    /* Draw pages */

    Object.keys(positions).forEach(page => {

        const x = positions[page][0];

        const y = positions[page][1];


        const group =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );


        group.setAttribute(
            "class",
            "node"
        );


        const circle =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );


        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);

        circle.setAttribute("r", 42);


        const name =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );


        name.setAttribute("x", x);

        name.setAttribute("y", y - 3);

        name.setAttribute(
            "text-anchor",
            "middle"
        );

        name.textContent =
            "PAGE " + page;


        const scoreText =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );


        scoreText.setAttribute(
            "class",
            "scoreText"
        );

        scoreText.setAttribute("x", x);

        scoreText.setAttribute(
            "y",
            y + 18
        );

        scoreText.setAttribute(
            "text-anchor",
            "middle"
        );

        scoreText.textContent =
            pageScores[page].toFixed(3);


        group.appendChild(circle);

        group.appendChild(name);

        group.appendChild(scoreText);

        svg.appendChild(group);

    });

}


/* ---------- PAGE RANK ---------- */

function runRound() {

    const newScores = {

        A: 0,
        B: 0,
        C: 0,
        D: 0

    };


    /*
        Each page distributes its score
        equally among its outgoing links.
    */

    Object.keys(pageScores).forEach(page => {

        const outgoing =
            links.filter(
                link => link[0] === page
            );


        /*
            If a page has no links,
            distribute its score equally
            to every page.
        */

        if (outgoing.length === 0) {

            Object.keys(newScores)
                .forEach(target => {

                    newScores[target] +=
                        pageScores[page] / 4;

                });

        }


        else {

            const amount =
                pageScores[page]
                / outgoing.length;


            outgoing.forEach(link => {

                const target = link[1];

                newScores[target] += amount;

            });

        }

    });


    pageScores = newScores;


    round++;


    updateRound();

    updateRanking();

    drawNetwork();


    /* Give the player points */

    score += 100;

    document.getElementById(
        "score"
    ).textContent = score;


    document.getElementById(
        "message"
    ).textContent =
        "Round " +
        round +
        " complete! Importance has moved through the link network.";


    if (round === 3) {

        score += 200;

        document.getElementById(
            "score"
        ).textContent = score;


        document.getElementById(
            "message"
        ).textContent =
            "Great! Three rounds complete. Page A should now be the strongest page.";

    }

}


/* ---------- RANKING ---------- */

function updateRanking() {

    const container =
        document.getElementById(
            "rankingList"
        );


    const sorted =
        Object.entries(pageScores)
        .sort(
            (a, b) =>
                b[1] - a[1]
        );


    container.innerHTML = "";


    sorted.forEach(
        ([page, value], index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className = "rank";


            row.innerHTML = `

                <span class="rank-number">
                    0${index + 1}
                </span>

                <span class="rank-name">
                    Page ${page}
                </span>

                <span class="rank-score">
                    ${value.toFixed(4)}
                </span>

            `;


            container.appendChild(row);

        }
    );

}


/* ---------- ROUND DISPLAY ---------- */

function updateRound() {

    document.getElementById(
        "round"
    ).textContent =
        round + " / 3";

}


/* ---------- RESET ---------- */

function resetGame() {

    round = 0;

    score = 0;


    pageScores = {

        A: 0.25,
        B: 0.25,
        C: 0.25,
        D: 0.25

    };


    document.getElementById(
        "score"
    ).textContent = 0;


    document.getElementById(
        "message"
    ).textContent =
        "Each page starts with a score of 0.25.";


    updateRound();

    updateRanking();

    drawNetwork();

}


/* =========================================
   RANDOM SURFER
   ========================================= */

let visits = {

    A: 0,
    B: 0,
    C: 0,
    D: 0

};


function startSurfer() {

    visits = {

        A: 0,
        B: 0,
        C: 0,
        D: 0

    };


    let current = "A";


    let step = 0;


    const surfer =
        document.getElementById(
            "surfer"
        );


    const interval =
        setInterval(() => {

            visits[current]++;


            /* Move the surfer visually */

            surfer.style.transform =
                `translateX(${Math.sin(step) * 100}px)`;


            /* Find outgoing links */

            const outgoing =
                links.filter(
                    link =>
                        link[0] === current
                );


            if (outgoing.length > 0) {

                const random =
                    Math.floor(
                        Math.random()
                        * outgoing.length
                    );


                current =
                    outgoing[random][1];

            }


            else {

                const pages =
                    ["A", "B", "C", "D"];


                current =
                    pages[
                        Math.floor(
                            Math.random()
                            * pages.length
                        )
                    ];

            }


            step++;


            updateVisits();


            if (step >= 30) {

                clearInterval(
                    interval
                );


                score += 250;


                document.getElementById(
                    "score"
                ).textContent =
                    score;


                document.getElementById(
                    "message"
                ).textContent =
                    "The surfer simulation is complete. The page receiving more visits is more important in this model.";

            }

        }, 180);

}


/* ---------- VISIT DISPLAY ---------- */

function updateVisits() {

    const container =
        document.getElementById(
            "visits"
        );


    container.innerHTML = "";


    Object.keys(visits)
        .forEach(page => {

            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "visit";


            box.innerHTML = `

                Page ${page}

                <strong>
                    ${visits[page]}
                </strong>

                visits

            `;


            container.appendChild(box);

        });

}


/* =========================================
   QUIZ
   ========================================= */

const questions = [

    {
        question:
            "Is PageRank simply counting links?",

        answers: [
            "Yes",
            "No"
        ],

        correct: 1
    },


    {
        question:
            "What does the random surfer represent?",

        answers: [
            "A person clicking links",
            "A search engine employee",
            "A website owner"
        ],

        correct: 0
    },


    {
        question:
            "Why is damping useful?",

        answers: [
            "It makes websites faster",
            "It helps escape loops",
            "It removes links"
        ],

        correct: 1
    },


    {
        question:
            "What can make a page important?",

        answers: [
            "Links from important pages",
            "Having a long URL",
            "Using many colors"
        ],

        correct: 0
    }

];


function createQuiz() {

    const quiz =
        document.getElementById(
            "quiz"
        );


    questions.forEach(
        (question, qIndex) => {

            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "question";


            const title =
                document.createElement(
                    "p"
                );


            title.textContent =
                (qIndex + 1) +
                ". " +
                question.question;


            box.appendChild(title);


            const answers =
                document.createElement(
                    "div"
                );


            answers.className =
                "answers";


            question.answers.forEach(
                (answer, aIndex) => {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.textContent =
                        answer;


                    button.onclick =
                        () => {

                            if (
                                aIndex ===
                                question.correct
                            ) {

                                button.classList
                                    .add(
                                        "correct"
                                    );


                                score += 100;


                                document.getElementById(
                                    "score"
                                ).textContent =
                                    score;

                            }

                            else {

                                button.classList
                                    .add(
                                        "wrong"
                                    );

                            }

                        };


                    answers.appendChild(
                        button
                    );

                }
            );


            box.appendChild(
                answers
            );


            quiz.appendChild(
                box
            );

        }
    );

}


/* ---------- START GAME ---------- */

drawNetwork();

updateRanking();

updateVisits();

createQuiz();
