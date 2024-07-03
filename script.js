let jugs = [0, 0, 0];
let goalState = [0, 0, 0];
const maxCapacity = [40000, 30000, 50000]; // Adjust according to your jug capacities

function updateJugs() {
    document.getElementById('jug1').innerText = jugs[0] + '/' + maxCapacity[0];
    document.getElementById('jug2').innerText = jugs[1] + '/' + maxCapacity[1];
    document.getElementById('jug3').innerText = jugs[2] + '/' + maxCapacity[2];
}

function fillJug(jug) {
    jugs[jug - 1] = maxCapacity[jug - 1];
    updateJugs();
}

function pour(from, to) {
    const amountToPour = Math.min(jugs[from - 1], maxCapacity[to - 1] - jugs[to - 1]);
    jugs[from - 1] -= amountToPour;
    jugs[to - 1] += amountToPour;
    updateJugs();
}

function emptyJug(jug) {
    jugs[jug - 1] = 0;
    updateJugs();
}

function checkGoal() {
    if (JSON.stringify(jugs) === JSON.stringify(goalState)) {
        alert("Goal state reached!");
    } else {
        alert("Goal state not reached!");
    }
}

function setGoal() {
    const goal1 = parseInt(document.getElementById('goal1').value);
    const goal2 = parseInt(document.getElementById('goal2').value);
    const goal3 = parseInt(document.getElementById('goal3').value);
    if (!isNaN(goal1) && !isNaN(goal2) && !isNaN(goal3)) {
        goalState = [goal1, goal2, goal3];
        updateJugs();
    } else {
        alert("Please enter valid goal values.");
    }
}

function displaySolution() {
    const solutionSteps = breadthFirstSearch();
    if (solutionSteps) {
        let stepsHTML = "<h2>Solution Steps:</h2>";
        for (let i = 0; i < solutionSteps.length; i++) {
            stepsHTML += `<p>Step ${i + 1}: ${solutionSteps[i]}</p>`;
        }
        document.getElementById('solution-steps').innerHTML = stepsHTML;
    } else {
        document.getElementById('solution-steps').innerText = "No solution found.";
    }
}

function breadthFirstSearch() {
    const visited = new Set();
    const queue = [];
    queue.push([[0, 0, 0], []]); // Initial state and actions
    visited.add(JSON.stringify([0, 0, 0]));

    while (queue.length > 0) {
        const [currentState, actions] = queue.shift();

        if (JSON.stringify(currentState) === JSON.stringify(goalState)) {
            return actions;
        }

        for (let i = 0; i < 3; i++) {
            if (currentState[i] < maxCapacity[i]) {
                const newState = currentState.slice();
                newState[i] = maxCapacity[i];
                if (!visited.has(JSON.stringify(newState))) {
                    visited.add(JSON.stringify(newState));
                    queue.push([newState, [...actions, `Fill Jug ${i + 1}`]]);
                }
            }
            if (currentState[i] > 0) {
                const newState = currentState.slice();
                newState[i] = 0;
                if (!visited.has(JSON.stringify(newState))) {
                    visited.add(JSON.stringify(newState));
                    queue.push([newState, [...actions, `Empty Jug ${i + 1}`]]);
                }
            }
            for (let j = 0; j < 3; j++) {
                if (i !== j) {
                    const newState = currentState.slice();
                    const amountToPour = Math.min(newState[i], maxCapacity[j] - newState[j]);
                    newState[i] -= amountToPour;
                    newState[j] += amountToPour;
                    if (!visited.has(JSON.stringify(newState))) {
                        visited.add(JSON.stringify(newState));
                        queue.push([newState, [...actions, `Pour from Jug ${i + 1} to Jug ${j + 1}`]]);
                    }
                }
            }
        }
    }
    return null;
}
