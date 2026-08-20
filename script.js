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

const form =
    document.getElementById("feedbackForm");

const nameInput =
    document.getElementById("name");

const reasonSelect =
    document.getElementById("reason");

const additionalTextGroup =
    document.getElementById("additionalTextGroup");

const additionalText =
    document.getElementById("additionalText");

const submitButton =
    document.getElementById("submitButton");

const statusMessage =
    document.getElementById("statusMessage");

const successActions =
    document.getElementById("successActions");


// ==========================================
// STARTZUSTAND
// ==========================================

// Die Seite geht beim Laden immer davon aus,
// dass noch kein Feedback abgegeben wurde.

if (successActions) {

    successActions.classList.add("hidden");

    successActions.style.display = "none";

}


// ==========================================
// SONSTIGE EIN-/AUSBLENDEN
// ==========================================

reasonSelect.addEventListener("change", () => {

    if (reasonSelect.value === "Sonstige") {

        additionalTextGroup
            .classList
            .remove("hidden");

        additionalText.required = true;

    } else {

        additionalTextGroup
            .classList
            .add("hidden");

        additionalText.required = false;

        additionalText.value = "";

    }

});


// ==========================================
// FEEDBACK ABSENDEN
// ==========================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
        nameInput.value.trim();

    const reason =
        reasonSelect.value;

    const text =
        additionalText.value.trim();


    // ======================================
    // SICHERHEITSPRÜFUNG
    // ======================================

    if (!reason) {

        showStatus(
            "Bitte wähle einen Grund aus.",
            "error"
        );

        return;

    }


    if (
        reason === "Sonstige" &&
        !text
    ) {

        showStatus(
            "Bitte beschreibe den sonstigen Grund.",
            "error"
        );

        return;

    }


    // ======================================
    // BUTTON DEAKTIVIEREN
    // ======================================

    submitButton.disabled = true;

    submitButton.textContent =
        "Wird gesendet...";


    // ======================================
    // DATEN VORBEREITEN
    // ======================================

    const feedback = {

        name:
            name === ""
                ? null
                : name,

        reason:
            reason,

        additional_text:
            reason === "Sonstige"
                ? text
                : null

    };


    try {

        // ==================================
        // SUPABASE
        // ==================================

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/feedback`,
            {
                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`,

                    "Prefer":
                        "return=minimal"

                },

                body:
                    JSON.stringify(feedback)

            }
        );


        // ==================================
        // FEHLER PRÜFEN
        // ==================================

        if (!response.ok) {

            const error =
                await response.text();

            console.error(
                "Supabase-Fehler:",
                error
            );

            throw new Error(
                "Feedback konnte nicht gespeichert werden."
            );

        }


        // ==================================
        // ERFOLGREICH
        // ==================================

        form.reset();


        additionalTextGroup
            .classList
            .add("hidden");

        additionalText.required = false;


        showStatus(
            "Vielen Dank für dein Feedback!",
            "success"
        );


        // ==================================
        // LÖSUNGEN & PDF FREISCHALTEN
        // ==================================

        if (successActions) {

            successActions
                .classList
                .remove("hidden");

            successActions.style.display =
                "flex";

        }


    } catch (error) {

        console.error(error);


        showStatus(
            "Das Feedback konnte nicht gesendet werden.",
            "error"
        );


    } finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Feedback absenden";

    }

});


// ==========================================
// STATUSMELDUNG
// ==========================================

function showStatus(message, type) {

    statusMessage.textContent =
        message;

    statusMessage.className =
        `status ${type}`;

}