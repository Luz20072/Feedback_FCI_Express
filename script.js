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

const participationSelect =
    document.getElementById("participation");

const nameInput =
    document.getElementById("name");


// Nicht teilgenommen

const notParticipatedForm =
    document.getElementById("notParticipatedForm");

const reasonSelect =
    document.getElementById("reason");

const additionalTextGroup =
    document.getElementById("additionalTextGroup");

const additionalText =
    document.getElementById("additionalText");


// Teilgenommen

const participatedForm =
    document.getElementById("participatedForm");

const overallRating =
    document.getElementById("overall_rating");

const difficulty =
    document.getElementById("difficulty");

const lengthRating =
    document.getElementById("length_rating");

const clueClarity =
    document.getElementById("clue_clarity");

const varietyRating =
    document.getElementById("variety_rating");

const funRating =
    document.getElementById("fun_rating");

const positiveFeedback =
    document.getElementById("positive_feedback");

const improvementFeedback =
    document.getElementById("improvement_feedback");

const additionalFeedback =
    document.getElementById("additional_feedback");


// Allgemein

const submitButton =
    document.getElementById("submitButton");

const statusMessage =
    document.getElementById("statusMessage");

const successActions =
    document.getElementById("successActions");


// ==========================================
// STARTZUSTAND
// ==========================================

if (successActions) {

    successActions.classList.add("hidden");

    successActions.style.display =
        "none";

}


// ==========================================
// TEILNAHME AUSWÄHLEN
// ==========================================

participationSelect.addEventListener(
    "change",
    () => {

        // ==================================
        // TEILGENOMMEN
        // ==================================

        if (
            participationSelect.value ===
            "Teilgenommen"
        ) {

            participatedForm
                .classList
                .remove("hidden");

            notParticipatedForm
                .classList
                .add("hidden");


            // Pflichtfelder aktivieren

            overallRating.required = true;
            difficulty.required = true;
            lengthRating.required = true;
            clueClarity.required = true;
            varietyRating.required = true;
            funRating.required = true;


            // Felder des anderen Formulars
            // nicht mehr erforderlich

            reasonSelect.required = false;
            additionalText.required = false;


            // Alte Werte löschen

            reasonSelect.value = "";

            additionalText.value = "";

            additionalTextGroup
                .classList
                .add("hidden");

        }


        // ==================================
        // NICHT TEILGENOMMEN
        // ==================================

        else if (
            participationSelect.value ===
            "Nicht teilgenommen"
        ) {

            notParticipatedForm
                .classList
                .remove("hidden");

            participatedForm
                .classList
                .add("hidden");


            // Grund erforderlich

            reasonSelect.required = true;


            // Teilnehmerfragen nicht erforderlich

            overallRating.required = false;
            difficulty.required = false;
            lengthRating.required = false;
            clueClarity.required = false;
            varietyRating.required = false;
            funRating.required = false;


            // Teilnehmerfelder zurücksetzen

            overallRating.value = "";
            difficulty.value = "";
            lengthRating.value = "";
            clueClarity.value = "";
            varietyRating.value = "";
            funRating.value = "";

            positiveFeedback.value = "";
            improvementFeedback.value = "";
            additionalFeedback.value = "";

        }

    }
);


// ==========================================
// SONSTIGE EIN-/AUSBLENDEN
// ==========================================

reasonSelect.addEventListener(
    "change",
    () => {

        if (
            reasonSelect.value ===
            "Sonstige"
        ) {

            additionalTextGroup
                .classList
                .remove("hidden");

            additionalText.required = true;

        }

        else {

            additionalTextGroup
                .classList
                .add("hidden");

            additionalText.required = false;

            additionalText.value = "";

        }

    }
);


// ==========================================
// FEEDBACK ABSENDEN
// ==========================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // ==================================
        // GRUNDWERTE
        // ==================================

        const participation =
            participationSelect.value;

        const name =
            nameInput.value.trim();


        // ==================================
        // TEILNAHME PRÜFEN
        // ==================================

        if (!participation) {

            showStatus(
                "Bitte wähle zuerst aus, ob du teilgenommen hast.",
                "error"
            );

            return;

        }


        // ==================================
        // NICHT TEILGENOMMEN
        // ==================================

        if (
            participation ===
            "Nicht teilgenommen"
        ) {

            const reason =
                reasonSelect.value;

            const text =
                additionalText.value.trim();


            // Grund prüfen

            if (!reason) {

                showStatus(
                    "Bitte wähle einen Grund aus.",
                    "error"
                );

                return;

            }


            // Sonstigen Grund prüfen

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


            // Button deaktivieren

            submitButton.disabled = true;

            submitButton.textContent =
                "Wird gesendet...";


            // Daten vorbereiten

            const feedback = {

                name:
                    name === ""
                        ? null
                        : name,

                participation:
                    "Nicht teilgenommen",

                reason:
                    reason,

                additional_text:
                    reason === "Sonstige"
                        ? text
                        : null,

                overall_rating:
                    null,

                difficulty:
                    null,

                length_rating:
                    null,

                clue_clarity:
                    null,

                variety_rating:
                    null,

                fun_rating:
                    null,

                positive_feedback:
                    null,

                improvement_feedback:
                    null,

                additional_feedback:
                    null

            };


            await submitFeedback(
                feedback
            );

            return;

        }


        // ==================================
        // TEILGENOMMEN
        // ==================================

        if (
            participation ===
            "Teilgenommen"
        ) {

            // ==================================
            // PFLICHTFELDER PRÜFEN
            // ==================================

            if (
                !overallRating.value ||
                !difficulty.value ||
                !lengthRating.value ||
                !clueClarity.value ||
                !varietyRating.value ||
                !funRating.value
            ) {

                showStatus(
                    "Bitte beantworte alle Pflichtfragen.",
                    "error"
                );

                return;

            }


            // ==================================
            // BUTTON DEAKTIVIEREN
            // ==================================

            submitButton.disabled = true;

            submitButton.textContent =
                "Wird gesendet...";


            // ==================================
            // DATEN VORBEREITEN
            // ==================================

            const feedback = {

                name:
                    name === ""
                        ? null
                        : name,

                participation:
                    "Teilgenommen",

                reason:
                    null,

                additional_text:
                    null,

                overall_rating:
                    overallRating.value,

                difficulty:
                    difficulty.value,

                length_rating:
                    lengthRating.value,

                clue_clarity:
                    clueClarity.value,

                variety_rating:
                    varietyRating.value,

                fun_rating:
                    funRating.value,

                positive_feedback:
                    positiveFeedback.value.trim() ||
                    null,

                improvement_feedback:
                    improvementFeedback.value.trim() ||
                    null,

                additional_feedback:
                    additionalFeedback.value.trim() ||
                    null

            };


            await submitFeedback(
                feedback
            );

        }

    }
);


// ==========================================
// SUPABASE FEEDBACK SENDEN
// ==========================================

async function submitFeedback(
    feedback
) {

    try {

        const response =
            await fetch(
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
                        JSON.stringify(
                            feedback
                        )

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


        participatedForm
            .classList
            .add("hidden");

        notParticipatedForm
            .classList
            .add("hidden");

        additionalTextGroup
            .classList
            .add("hidden");


        additionalText.required =
            false;


        showStatus(
            "Vielen Dank für dein Feedback!",
            "success"
        );


        // ==================================
        // ZUGRIFF AUF LÖSUNGEN FREIGEBEN
        // ==================================

        sessionStorage.setItem(
            "feedbackSubmitted",
            "true"
        );


        // ==================================
        // LÖSUNGEN & PDF ANZEIGEN
        // ==================================

        if (successActions) {

            successActions
                .classList
                .remove("hidden");

            successActions.style.display =
                "flex";

        }


    }

    catch (error) {

        console.error(
            error
        );


        showStatus(
            "Das Feedback konnte nicht gesendet werden.",
            "error"
        );

    }


    finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Feedback absenden";

    }

}


// ==========================================
// STATUSMELDUNG
// ==========================================

function showStatus(
    message,
    type
) {

    statusMessage.textContent =
        message;

    statusMessage.className =
        `status ${type}`;

}