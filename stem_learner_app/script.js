const subjects = [
    {name: "Science", icon: "🔬", color: "#84cc16", text: "Discover how the world around us works."},
    {name: "Technology", icon: "💻", color: "#a855f7", text: "Learn coding, computers, AI and digital technology."},
    {name: "Engineering", icon: "⚙️", color: "#f59e0b", text: "Design, build and solve real-world problems."},
    {name: "Mathematics", icon: "📐", color: "#00e5ff", text: "Make mathematics fun through puzzles and challenges."}
];

const courses = [
    {id:"science-basics", subject:"Science", title:"Science Explorer", level:"Beginner", lessons:6, desc:"Matter, energy, forces and the scientific method."},
    {id:"space", subject:"Science", title:"Space & Solar System", level:"Beginner", lessons:5, desc:"Explore planets, stars, moons and our solar system."},
    {id:"web", subject:"Technology", title:"Web Development Basics", level:"Beginner", lessons:8, desc:"Build webpages with HTML, CSS and JavaScript."},
    {id:"python", subject:"Technology", title:"Python Coding", level:"Beginner", lessons:7, desc:"Learn programming concepts through small challenges."},
    {id:"robotics", subject:"Engineering", title:"Robotics Fundamentals", level:"Intermediate", lessons:6, desc:"Understand sensors, motors, logic and robot design."},
    {id:"design", subject:"Engineering", title:"Engineering Design", level:"Beginner", lessons:5, desc:"Learn how engineers plan, prototype and improve ideas."},
    {id:"math", subject:"Mathematics", title:"Math Challenge Lab", level:"Beginner", lessons:7, desc:"Practice patterns, logic, geometry and problem solving."},
    {id:"algebra", subject:"Mathematics", title:"Algebra Starter", level:"Intermediate", lessons:6, desc:"Build confidence with variables, equations and graphs."}
];

const projects = [
    {id:"volcano", icon:"🌋", title:"Volcano Experiment", time:"30 min", desc:"Explore a safe model of a chemical reaction.", steps:["Gather a cup, baking soda, vinegar and food coloring.","Place the baking soda in the cup.","Add a little food coloring.","Add vinegar and observe the reaction."]},
    {id:"robot", icon:"🤖", title:"Design a Robot", time:"45 min", desc:"Plan a robot that solves a real problem.", steps:["Choose a problem your robot should solve.","Sketch the robot and label its parts.","Decide what sensors or inputs it needs.","Explain how it would complete its task."]},
    {id:"solar", icon:"☀️", title:"Solar Energy Model", time:"40 min", desc:"Investigate how sunlight can be used as energy.", steps:["Research how solar panels produce electricity.","Draw a simple solar-energy system.","Label sunlight, panel, controller and load.","Explain two benefits of solar energy."]},
    {id:"bridge", icon:"🌉", title:"Paper Bridge Challenge", time:"25 min", desc:"Use engineering thinking to design a strong bridge.", steps:["Use paper and tape only.","Design a bridge between two supports.","Test how much weight it can hold.","Improve the design and test again."]}
];

const quizzes = [
    {
        id:"science-quiz", icon:"🔬", title:"Science Quiz", points:20,
        questions:[
            {q:"Which is a source of light?", options:["Moon","Sun","Rock","Soil"], answer:1},
            {q:"Water changes into vapor through...", options:["Freezing","Melting","Evaporation","Condensation"], answer:2},
            {q:"Plants use sunlight mainly to...", options:["Make food","Make sound","Move faster","Create rocks"], answer:0}
        ]
    },
    {
        id:"tech-quiz", icon:"💻", title:"Technology Quiz", points:20,
        questions:[
            {q:"Which language structures a webpage?", options:["HTML","JPEG","MP3","USB"], answer:0},
            {q:"What does CPU commonly mean?", options:["Central Processing Unit","Computer Power Utility","Code Program User","Central Print Unit"], answer:0},
            {q:"Which is used to style webpages?", options:["CSS","GPS","PDF","RAM"], answer:0}
        ]
    },
    {
        id:"math-quiz", icon:"📐", title:"Math Quiz", points:20,
        questions:[
            {q:"What is 7 × 8?", options:["48","54","56","64"], answer:2},
            {q:"A triangle has how many sides?", options:["2","3","4","5"], answer:1},
            {q:"What is half of 100?", options:["25","40","50","75"], answer:2}
        ]
    }
];

const defaultState = {
    name: "",
    completedCourses: [],
    completedProjects: [],
    quizScores: {},
    points: 0,
    theme: "dark"
};

let state = loadState();

function loadState() {
    try {
        return {...defaultState, ...JSON.parse(localStorage.getItem("stemLearnerState"))};
    } catch {
        return {...defaultState};
    }
}

function saveState() {
    localStorage.setItem("stemLearnerState", JSON.stringify(state));
}

function renderSubjects() {
    document.getElementById("subjectGrid").innerHTML = subjects.map(s => `
        <article class="subject-card" style="border-top:3px solid ${s.color}">
            <div class="subject-icon">${s.icon}</div>
            <h3>${s.name}</h3>
            <p>${s.text}</p>
            <button class="subject-card-action" data-subject="${s.name}">View ${s.name} →</button>
        </article>
    `).join("");

    document.querySelectorAll(".subject-card-action").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("courses").scrollIntoView({behavior:"smooth"});
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.filter === btn.dataset.subject));
            renderCourses(btn.dataset.subject);
        });
    });
}

function renderCourses(filter = "All") {
    const visible = filter === "All" ? courses : courses.filter(c => c.subject === filter);
    document.getElementById("courseGrid").innerHTML = visible.map(c => {
        const done = state.completedCourses.includes(c.id);
        return `
        <article class="course-card">
            <span class="badge">${c.subject} · ${c.level}</span>
            <h3>${c.title}</h3>
            <p>${c.desc}</p>
            <div class="course-meta"><span>${c.lessons} lessons</span><span>${done ? "Completed ✓" : "Not started"}</span></div>
            <div class="progress-bar"><span style="width:${done ? 100 : 0}%"></span></div>
            <button class="primary-btn card-action" data-course="${c.id}">${done ? "Completed ✓" : "Start Course"}</button>
        </article>`;
    }).join("");

    document.querySelectorAll("[data-course]").forEach(btn => {
        btn.addEventListener("click", () => openCourse(btn.dataset.course));
    });
}

function openCourse(id) {
    const course = courses.find(c => c.id === id);
    const done = state.completedCourses.includes(id);

    document.getElementById("modalContent").innerHTML = `
        <span class="badge">${course.subject} · ${course.level}</span>
        <h2>${course.title}</h2>
        <p>${course.desc}</p>
        <h3 style="margin-top:20px">Learning plan</h3>
        <ol style="margin:12px 0 20px 20px">
            ${Array.from({length:course.lessons}, (_,i) => `<li>Lesson ${i+1}: ${lessonName(course.subject, i)}</li>`).join("")}
        </ol>
        <button class="primary-btn full" id="completeCourse">${done ? "Course Completed ✓" : "Mark Course Complete"}</button>
    `;

    document.getElementById("contentModal").classList.remove("hidden");

    document.getElementById("completeCourse").addEventListener("click", () => {
        if (!state.completedCourses.includes(id)) state.completedCourses.push(id);
        saveState();
        updateDashboard();
        renderCourses(document.querySelector(".filter-btn.active")?.dataset.filter || "All");
        closeModal("contentModal");
    });
}

function lessonName(subject, i) {
    const names = {
        Science:["Observation","Matter","Energy","Forces","Experiments","Review"],
        Technology:["Computers","HTML","CSS","JavaScript","Algorithms","Projects","Testing","Review"],
        Engineering:["Problems","Ideas","Design","Prototype","Testing","Improvement"],
        Mathematics:["Patterns","Numbers","Geometry","Logic","Equations","Challenge","Review"]
    };
    return names[subject]?.[i] || "Exploration";
}

function renderProjects() {
    document.getElementById("projectGrid").innerHTML = projects.map(p => {
        const done = state.completedProjects.includes(p.id);
        return `
        <article class="project-card">
            <div class="project-icon">${p.icon}</div>
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
            <small>${p.time}</small>
            <br>
            <button class="secondary-btn" data-project="${p.id}">${done ? "Completed ✓" : "View Project"}</button>
        </article>`;
    }).join("");

    document.querySelectorAll("[data-project]").forEach(btn => {
        btn.addEventListener("click", () => openProject(btn.dataset.project));
    });
}

function openProject(id) {
    const p = projects.find(x => x.id === id);
    const done = state.completedProjects.includes(id);

    document.getElementById("modalContent").innerHTML = `
        <div class="project-icon">${p.icon}</div>
        <h2>${p.title}</h2>
        <p>${p.desc}</p>
        <h3 style="margin-top:20px">Steps</h3>
        <ol style="margin:12px 0 20px 20px">
            ${p.steps.map(s => `<li style="margin-bottom:8px">${s}</li>`).join("")}
        </ol>
        <button class="primary-btn full" id="completeProject">${done ? "Project Completed ✓" : "Mark Project Complete"}</button>
    `;

    document.getElementById("contentModal").classList.remove("hidden");

    document.getElementById("completeProject").addEventListener("click", () => {
        if (!state.completedProjects.includes(id)) state.completedProjects.push(id);
        saveState();
        updateDashboard();
        renderProjects();
        closeModal("contentModal");
    });
}

function renderQuizzes() {
    document.getElementById("quizGrid").innerHTML = quizzes.map(q => {
        const score = state.quizScores[q.id];
        return `
        <article class="quiz-card">
            <div class="quiz-icon">${q.icon}</div>
            <h3>${q.title}</h3>
            <p>${q.questions.length} questions · Up to ${q.points} points</p>
            <button class="primary-btn" data-quiz="${q.id}">${score != null ? `Retake · Best ${score}` : "Start Quiz"}</button>
        </article>`;
    }).join("");

    document.querySelectorAll("[data-quiz]").forEach(btn => {
        btn.addEventListener("click", () => openQuiz(btn.dataset.quiz));
    });
}

function openQuiz(id) {
    const quiz = quizzes.find(q => q.id === id);

    document.getElementById("modalContent").innerHTML = `
        <h2>${quiz.icon} ${quiz.title}</h2>
        <p>Choose the best answer for each question.</p>
        <div id="quizQuestions">
            ${quiz.questions.map((item, index) => `
                <div style="margin-top:22px">
                    <strong>${index+1}. ${item.q}</strong>
                    ${item.options.map((opt, oi) => `
                        <button class="quiz-option" data-question="${index}" data-answer="${oi}">${opt}</button>
                    `).join("")}
                </div>
            `).join("")}
        </div>
        <div id="quizResult"></div>
    `;

    document.getElementById("contentModal").classList.remove("hidden");

    const answers = {};
    document.querySelectorAll(".quiz-option").forEach(btn => {
        btn.addEventListener("click", () => {
            const qi = Number(btn.dataset.question);
            answers[qi] = Number(btn.dataset.answer);
            document.querySelectorAll(`[data-question="${qi}"]`).forEach(b => b.style.outline = "none");
            btn.style.outline = `2px solid var(--cyan)`;
        });
    });

    const submit = document.createElement("button");
    submit.className = "primary-btn full";
    submit.style.marginTop = "25px";
    submit.textContent = "Submit Quiz";
    document.getElementById("modalContent").appendChild(submit);

    submit.addEventListener("click", () => {
        if (Object.keys(answers).length < quiz.questions.length) {
            document.getElementById("quizResult").innerHTML = `<div class="result">Please answer every question first.</div>`;
            return;
        }

        let correct = 0;
        quiz.questions.forEach((q, i) => {
            if (answers[i] === q.answer) correct++;
        });

        const score = Math.round((correct / quiz.questions.length) * quiz.points);
        const previous = state.quizScores[quiz.id] || 0;
        state.quizScores[quiz.id] = Math.max(previous, score);
        state.points += Math.max(0, score - previous);
        saveState();
        updateDashboard();
        renderQuizzes();

        document.getElementById("quizResult").innerHTML = `
            <div class="result">
                <h3>You scored ${score}/${quiz.points} 🎉</h3>
                <p>${correct} of ${quiz.questions.length} answers were correct.</p>
                <button class="primary-btn" id="closeQuizAfter">Done</button>
            </div>
        `;
        submit.disabled = true;
        document.getElementById("closeQuizAfter").addEventListener("click", () => closeModal("contentModal"));
    });
}

function updateDashboard() {
    const total = courses.length;
    const completed = state.completedCourses.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pointsCount").textContent = state.points;
    document.getElementById("progressPercent").textContent = `${percent}%`;
    document.getElementById("progressRing").style.setProperty("--progress", `${percent}%`);
    document.getElementById("welcomeText").textContent = state.name ? `Welcome, ${state.name}!` : "Welcome, Learner!";

    document.getElementById("courseCount").textContent = courses.length;
    document.getElementById("projectCount").textContent = projects.length;
    document.getElementById("quizCount").textContent = quizzes.length;
}

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}

function initTheme() {
    if (state.theme === "light") document.body.classList.add("light");
    document.getElementById("themeToggle").textContent = state.theme === "light" ? "🌙" : "☀️";
}

document.getElementById("startLearning").addEventListener("click", () => document.getElementById("courses").scrollIntoView({behavior:"smooth"}));
document.getElementById("ctaStart").addEventListener("click", () => document.getElementById("courses").scrollIntoView({behavior:"smooth"}));
document.getElementById("exploreProjects").addEventListener("click", () => document.getElementById("projects").scrollIntoView({behavior:"smooth"}));

document.getElementById("courseFilters").addEventListener("click", e => {
    if (!e.target.classList.contains("filter-btn")) return;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    renderCourses(e.target.dataset.filter);
});

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    state.theme = document.body.classList.contains("light") ? "light" : "dark";
    document.getElementById("themeToggle").textContent = state.theme === "light" ? "🌙" : "☀️";
    saveState();
});

document.getElementById("loginButton").addEventListener("click", () => {
    document.getElementById("nameInput").value = state.name;
    document.getElementById("loginModal").classList.remove("hidden");
});

document.getElementById("saveName").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value.trim();
    state.name = name || "Learner";
    saveState();
    updateDashboard();
    closeModal("loginModal");
});

document.getElementById("resetProgress").addEventListener("click", () => {
    if (!confirm("Reset all local learning progress?")) return;
    state.completedCourses = [];
    state.completedProjects = [];
    state.quizScores = {};
    state.points = 0;
    saveState();
    renderCourses();
    renderProjects();
    renderQuizzes();
    updateDashboard();
});

document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
});

document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.add("hidden");
    });
});

document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(a => {
    a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open"));
});

renderSubjects();
renderCourses();
renderProjects();
renderQuizzes();
updateDashboard();
initTheme();
