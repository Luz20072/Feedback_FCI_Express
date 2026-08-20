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

            const response =
                await fetch(
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

        const response =
            await fetch(
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


        displayStatistics(
            feedbacks
        );

        displayFeedbacks(
            feedbacks
        );


    } catch (error) {

        console.error(error);

        feedbackList.innerHTML =
            `<p id="error">${escapeHtml(error.message)}</p>`;

    }

}


// ==========================================
// STATISTIK
// ==========================================

function displayStatistics(
    feedbacks
) {

    const participants =
        feedbacks.filter(
            feedback =>
                feedback.participation ===
                "Teilgenommen"
        );


    const nonParticipants =
        feedbacks.filter(
            feedback =>
                feedback.participation ===
                "Nicht teilgenommen"
        );


    document.getElementById(
        "totalCount"
    ).textContent =
        feedbacks.length;


    document.getElementById(
        "participantCount"
    ).textContent =
        participants.length;


    document.getElementById(
        "nonParticipantCount"
    ).textContent =
        nonParticipants.length;


    document.getElementById(
        "noTimeCount"
    ).textContent =
        nonParticipants.filter(
            feedback =>
                feedback.reason ===
                "Keine Zeit"
        ).length;


    document.getElementById(
        "tooHardCount"
    ).textContent =
        nonParticipants.filter(
            feedback =>
                feedback.reason ===
                "Zu schwer"
        ).length;


    document.getElementById(
        "noDesireCount"
    ).textContent =
        nonParticipants.filter(
            feedback =>
                feedback.reason ===
                "Keine Lust"
        ).length;


    document.getElementById(
        "otherCount"
    ).textContent =
        nonParticipants.filter(
            feedback =>
                feedback.reason ===
                "Sonstige"
        ).length;

}


// ==========================================
// FEEDBACKS ANZEIGEN
// ==========================================

function displayFeedbacks(
    feedbacks
) {

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


            // ==================================
            // NICHT TEILGENOMMEN
            // ==================================

            if (
                feedback.participation ===
                "Nicht teilgenommen"
            ) {

                element.innerHTML = `

                    <div class="feedback-top">

                        <span class="feedback-name">
                            ${escapeHtml(name)}
                        </span>

                        <span class="feedback-date">
                            ${escapeHtml(date)}
                        </span>

                    </div>


                    <div class="feedback-type not-participated">
                        Nicht teilgenommen
                    </div>


                    <div class="feedback-reason">
                        Grund:
                        ${escapeHtml(
                            feedback.reason ||
                            "Keine Angabe"
                        )}
                    </div>


                    ${
                        feedback.additional_text
                            ? `
                                <div class="feedback-text">

                                    <strong>
                                        Weitere Angaben:
                                    </strong>

                                    <br>

                                    ${escapeHtml(
                                        feedback.additional_text
                                    )}

                                </div>
                              `
                            : ""
                    }

                `;

            }


            // ==================================
            // TEILGENOMMEN
            // ==================================

            else if (
                feedback.participation ===
                "Teilgenommen"
            ) {

                element.innerHTML = `

                    <div class="feedback-top">

                        <span class="feedback-name">
                            ${escapeHtml(name)}
                        </span>

                        <span class="feedback-date">
                            ${escapeHtml(date)}
                        </span>

                    </div>


                    <div class="feedback-type participated">
                        Teilgenommen
                    </div>


                    <div class="participant-answers">


                        <div class="answer">

                            <strong>
                                Gesamteindruck:
                            </strong>

                            <span>
                                ${escapeHtml(
                                    feedback.overall_rating ||
                                    "Keine Angabe"
                                )}
                            </span>

                        </div>


                        <div class="answer">

                            <strong>
                                Schwierigkeitsgrad:
                            </strong>

                            <span>
                                ${escapeHtml(
                                    feedback.difficulty ||
                                    "Keine Angabe"
                                )}
                            </span>

                        </div>


                        <div class="answer">

                            <strong>
                                Länge:
                            </strong>

                            <span>
                                ${escapeHtml(
                                    feedback.length_rating ||
                                    "Keine Angabe"
                                )}
                            </span>

                        </div>


                        <div class="answer">

                            <strong>
                                Verständlichkeit:
                            </strong>

                            <span>
                                ${escapeHtml(
                                    feedback.clue_clarity ||
                                    "Keine Angabe"
                                )}
                            </span>

                        </div>


                        <div class="answer">

                            <strong>
                                Abwechslung:
                            </strong>

                            <span>
                                ${escapeHtml(
                                    feedback.variety_rating ||
                                    "Keine Angabe"
                                )}
                            </span>

                        </div>


                        <div class="answer">

                            <strong>
                                Spaß:
                            </strong>

                            <span>
                                ${escapeHtml(
                                    feedback.fun_rating ||
                                    "Keine Angabe"
                                )}
                            </span>

                        </div>


                    </div>


                    ${
                        feedback.positive_feedback
                            ? `
                                <div class="feedback-text">

                                    <strong>
                                        Was hat gefallen?
                                    </strong>

                                    <br>

                                    ${escapeHtml(
                                        feedback.positive_feedback
                                    )}

                                </div>
                              `
                            : ""
                    }


                    ${
                        feedback.improvement_feedback
                            ? `
                                <div class="feedback-text">

                                    <strong>
                                        Verbesserungsvorschläge:
                                    </strong>

                                    <br>

                                    ${escapeHtml(
                                        feedback.improvement_feedback
                                    )}

                                </div>
                              `
                            : ""
                    }


                    ${
                        feedback.additional_feedback
                            ? `
                                <div class="feedback-text">

                                    <strong>
                                        Weitere Anmerkungen:
                                    </strong>

                                    <br>

                                    ${escapeHtml(
                                        feedback.additional_feedback
                                    )}

                                </div>
                              `
                            : ""
                    }

                `;

            }


            // ==================================
            // UNBEKANNTER / ALTER DATENSATZ
            // ==================================

            else {

                element.innerHTML = `

                    <div class="feedback-top">

                        <span class="feedback-name">
                            ${escapeHtml(name)}
                        </span>

                        <span class="feedback-date">
                            ${escapeHtml(date)}
                        </span>

                    </div>


                    <div class="feedback-type">
                        Teilnahme nicht angegeben
                    </div>

                `;

            }


            feedbackList.appendChild(
                element
            );

        }
    );

}


// ==========================================
// HTML ESCAPEN
// ==========================================

function escapeHtml(
    value
) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

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


// ==========================================
// ALLE FEEDBACKS LÖSCHEN
// ==========================================

const deleteAllButton =
    document.getElementById(
        "deleteAllButton"
    );


if (deleteAllButton) {

    deleteAllButton.addEventListener(
        "click",
        async function () {

            const confirmed =
                confirm(
                    "Möchtest du wirklich ALLE Feedbacks löschen?\n\n" +
                    "Diese Aktion kann nicht rückgängig gemacht werden."
                );


            if (!confirmed) {

                return;

            }


            deleteAllButton.disabled =
                true;

            deleteAllButton.textContent =
                "Lösche...";


            try {

                const response =
                    await fetch(
                        `${SUPABASE_URL}/rest/v1/feedback?id=not.is.null`,
                        {
                            method: "DELETE",

                            headers: {
                                "apikey":
                                    SUPABASE_KEY,

                                "Authorization":
                                    `Bearer ${accessToken}`,

                                "Prefer":
                                    "return=minimal"
                            }
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "Fehler beim Löschen:",
                        errorText
                    );

                    throw new Error(
                        "Feedbacks konnten nicht gelöscht werden."
                    );

                }


                alert(
                    "Alle Feedbacks wurden gelöscht."
                );


                await loadFeedback();


            } catch (error) {

                console.error(error);

                alert(
                    "Fehler beim Löschen der Feedbacks."
                );

            } finally {

                deleteAllButton.disabled =
                    false;

                deleteAllButton.textContent =
                    "Alle löschen";

            }

        }
    );

}