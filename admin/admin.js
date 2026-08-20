// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://zpcaadjshyryfhjzxswt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_9D-l2KFSLpl7DTcFQZjzbg_plBE8nb7";


// ==========================================
// ELEMENTE
// ==========================================

const loginSection =
    document.getElementById("loginSection");

const adminSection =
    document.getElementById("adminSection");

const loginForm =
    document.getElementById("loginForm");

const loginStatus =
    document.getElementById("loginStatus");

const logoutButton =
    document.getElementById("logoutButton");

const refreshButton =
    document.getElementById("refreshButton");

const feedbackList =
    document.getElementById("feedbackList");


// ==========================================
// SESSION
// ==========================================

let accessToken = null;


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;


        loginStatus.textContent =
            "Anmeldung läuft...";


        try {

            const response = await fetch(
                `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "apikey":
                            SUPABASE_KEY
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error_description ||
                    data.msg ||
                    "Anmeldung fehlgeschlagen."
                );
            }


            accessToken =
                data.access_token;


            loginSection.classList.add(
                "hidden"
            );

            adminSection.classList.remove(
                "hidden"
            );


            loginStatus.textContent = "";


            loadFeedback();


        } catch (error) {

            console.error(error);

            loginStatus.textContent =
                error.message;

        }

    }
);


// ==========================================
// FEEDBACKS LADEN
// ==========================================

async function loadFeedback() {

    feedbackList.innerHTML =
        "<p>Lade Feedbacks...</p>";


    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/feedback?select=*&order=created_at.desc`,
            {
                method: "GET",

                headers: {
                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${accessToken}`
                }
            }
        );


        if (!response.ok) {

            const error =
                await response.text();

            console.error(error);

            throw new Error(
                "Feedbacks konnten nicht geladen werden."
            );
        }


        const feedbacks =
            await response.json();


        displayStatistics(feedbacks);

        displayFeedbacks(feedbacks);


    } catch (error) {

        console.error(error);

        feedbackList.innerHTML =
            `<p id="error">${error.message}</p>`;

    }

}


// ==========================================
// STATISTIK
// ==========================================

function displayStatistics(feedbacks) {

    document.getElementById("totalCount")
        .textContent = feedbacks.length;


    document.getElementById("noTimeCount")
        .textContent =
            feedbacks.filter(
                feedback =>
                    feedback.reason === "Keine Zeit"
            ).length;


    document.getElementById("tooHardCount")
        .textContent =
            feedbacks.filter(
                feedback =>
                    feedback.reason === "Zu schwer"
            ).length;


    document.getElementById("noDesireCount")
        .textContent =
            feedbacks.filter(
                feedback =>
                    feedback.reason === "Keine Lust"
            ).length;


    document.getElementById("otherCount")
        .textContent =
            feedbacks.filter(
                feedback =>
                    feedback.reason === "Sonstige"
            ).length;

}


// ==========================================
// FEEDBACKS ANZEIGEN
// ==========================================

function displayFeedbacks(feedbacks) {

    if (feedbacks.length === 0) {

        feedbackList.innerHTML =
            "<p>Noch keine Feedbacks vorhanden.</p>";

        return;
    }


    feedbackList.innerHTML = "";


    feedbacks.forEach(
        feedback => {

            const element =
                document.createElement("div");

            element.className =
                "feedback";


            const name =
                feedback.name ||
                "Anonym";


            const date =
                new Date(
                    feedback.created_at
                ).toLocaleString(
                    "de-DE"
                );


            element.innerHTML = `

                <div class="feedback-top">

                    <span class="feedback-name">
                        ${escapeHtml(name)}
                    </span>

                    <span class="feedback-date">
                        ${escapeHtml(date)}
                    </span>

                </div>

                <div class="feedback-reason">
                    Grund: ${escapeHtml(feedback.reason)}
                </div>

                ${
                    feedback.additional_text
                        ? `
                            <div class="feedback-text">
                                ${escapeHtml(
                                    feedback.additional_text
                                )}
                            </div>
                          `
                        : ""
                }

            `;


            feedbackList.appendChild(
                element
            );

        }
    );

}


// ==========================================
// HTML ESCAPEN
// ==========================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener(
    "click",
    () => {

        accessToken = null;

        adminSection.classList.add(
            "hidden"
        );

        loginSection.classList.remove(
            "hidden"
        );

        loginForm.reset();

    }
);


// ==========================================
// AKTUALISIEREN
// ==========================================

refreshButton.addEventListener(
    "click",
    loadFeedback
);