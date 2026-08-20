// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://zpcaadjshyryfhjzxswt.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_9D-l2KFSLpl7DTcFQZjzbg_plBE8nb7";


// ==========================================
// COOKIE-EINSTELLUNGEN
// ==========================================

const CLIENT_COOKIE_NAME =
    "fci_express_client_id";


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
// CLIENT-ID AUS COOKIE
// ==========================================

function getClientId() {

    const cookies =
        document.cookie.split(";");


    for (
        const cookie of cookies
    ) {

        const trimmed =
            cookie.trim();


        if (
            trimmed.startsWith(
                `${CLIENT_COOKIE_NAME}=`
            )
        ) {

            return decodeURIComponent(
                trimmed.substring(
                    CLIENT_COOKIE_NAME.length + 1
                )
            );

        }

    }


    return null;

}


// ==========================================
// CLIENT-ID ERZEUGEN
// ==========================================

function createClientId() {

    const clientId =
        crypto.randomUUID();


    /*
     * Das Cookie gilt für ein Jahr.
     *
     * SameSite=Lax:
     * Verhindert unnötige Cross-Site-Übertragung.
     *
     * Secure:
     * Wird nur über HTTPS übertragen.
     */

    document.cookie =
        `${CLIENT_COOKIE_NAME}=${encodeURIComponent(clientId)}; ` +
        "max-age=31536000; " +
        "path=/; " +
        "SameSite=Lax; " +
        "Secure";


    return clientId;

}


// ==========================================
// CLIENT-ID BESORGEN
// ==========================================

function getOrCreateClientId() {

    let clientId =
        getClientId();


    if (!clientId) {

        clientId =
            createClientId();

    }


    return clientId;

}


// ==========================================
// CLIENT-ID
// ==========================================

const clientId =
    getOrCreateClientId();


// ==========================================
// STARTZUSTAND
// ==========================================

notParticipatedForm
    .classList
    .add("hidden");

participatedForm
    .classList
    .add("hidden");

additionalTextGroup
    .classList
    .add("hidden");


if (successActions) {

    successActions
        .classList
        .add("hidden");

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


            overallRating.required = true;
            difficulty.required = true;
            lengthRating.required = true;
            clueClarity.required = true;
            varietyRating.required = true;
            funRating.required = true;


            reasonSelect.required = false;
            additionalText.required = false;


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


            reasonSelect.required = true;


            overallRating.required = false;
            difficulty.required = false;
            lengthRating.required = false;
            clueClarity.required = false;
            varietyRating.required = false;
            funRating.required = false;


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


            submitButton.disabled = true;

            submitButton.textContent =
                "Wird gesendet...";


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


            submitButton.disabled = true;

            submitButton.textContent =
                "Wird gesendet...";


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
// CLIENT-ID REGISTRIEREN
// ==========================================

async function reserveFeedbackSlot() {

    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/feedback_submissions`,
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
                    JSON.stringify({
                        client_id:
                            clientId
                    })

            }
        );


    // ======================================
    // BEREITS VERWENDET
    // ======================================

    if (
        response.status === 409
    ) {

        return false;

    }


    // ======================================
    // ANDERER FEHLER
    // ======================================

    if (!response.ok) {

        const error =
            await response.text();

        console.error(
            "Fehler bei Feedback-Sperre:",
            error
        );

        throw new Error(
            "Die Feedback-Sperre konnte nicht geprüft werden."
        );

    }


    return true;

}


// ==========================================
// RESERVIERUNG ZURÜCKNEHMEN
// ==========================================

async function releaseFeedbackSlot() {

    try {

        await fetch(
            `${SUPABASE_URL}/rest/v1/feedback_submissions?client_id=eq.${encodeURIComponent(clientId)}`,
            {

                method: "DELETE",

                headers: {

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`,

                    "Prefer":
                        "return=minimal"

                }

            }
        );

    }

    catch (error) {

        console.error(
            "Fehler beim Freigeben der Feedback-Sperre:",
            error
        );

    }

}


// ==========================================
// SUPABASE FEEDBACK SENDEN
// ==========================================

async function submitFeedback(
    feedback
) {

    let slotReserved =
        false;


    try {

        // ==================================
        // FEEDBACK-SLOT RESERVIEREN
        // ==================================

        slotReserved =
            await reserveFeedbackSlot();


        // ==================================
        // BEREITS ABGEGEBEN
        // ==================================

        if (!slotReserved) {

            showStatus(
                "Du hast bereits Feedback abgegeben.",
                "error"
            );

            return;

        }


        // ==================================
        // FEEDBACK SPEICHERN
        // ==================================

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


        notParticipatedForm
            .classList
            .add("hidden");

        participatedForm
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
        // LÖSUNGEN FREIGEBEN
        // ==================================

        sessionStorage.setItem(
            "feedbackSubmitted",
            "true"
        );


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


        // ==================================
        // SLOT FREIGEBEN
        // ==================================

        if (slotReserved) {

            await releaseFeedbackSlot();

        }


        showStatus(
            error.message ||
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