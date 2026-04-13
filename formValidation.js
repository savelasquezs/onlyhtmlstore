/**
 * Form validation helpers used by the Controller on checkout and contact submit.
 *
 * Combines HTML5 constraint validation (`pattern`, `minlength`, etc.) with
 * `setCustomValidity` for name rules. Phone inputs are normalized to digits only
 * before `checkValidity()` so pasted formatted numbers still pass.
 */

export const FormValidation = {
    /**
     * Returns a validation message for a person name field, or empty string if valid.
     * Used with `setCustomValidity`: non-empty string marks the field invalid.
     *
     * Rules: trimmed length 3–80, and must not be digits-only (e.g. "12345").
     *
     * @param {string} value — Raw input value.
     * @returns {string} Browser-facing message, or "" when valid.
     */
    personNameIssue(value) {
        const t = String(value).trim();
        if (t.length < 3) return "use at least 3 characters.";
        if (t.length > 80) return "maximum 80 characters.";
        if (/^\d+$/.test(t)) return "cannot be only numbers.";
        return "";
    },

    /**
     * Strips all non-digit characters from a telephone input (spaces, dashes, parentheses).
     * Mutates `inputEl.value` in place so subsequent `pattern` / length checks apply.
     *
     * @param {HTMLInputElement|null|undefined} inputEl
     */
    normalizePhoneField(inputEl) {
        if (!inputEl) return;
        inputEl.value = inputEl.value.replace(/\D/g, "");
    },

    /**
     * Applies custom name validation, then runs native form validation.
     * On failure, shows the first invalid field via `reportValidity()` and clears
     * custom messages so the next edit does not stay stuck invalid.
     *
     * @param {HTMLFormElement} form
     * @param {HTMLInputElement[]} nameEls — Typically first + last name inputs.
     * @returns {boolean} `true` if the form is valid and submission may proceed.
     */
    prepareAndReport(form, nameEls) {
        for (const el of nameEls) {
            el.setCustomValidity(FormValidation.personNameIssue(el.value));
        }
        if (!form.checkValidity()) {
            form.reportValidity();
            for (const el of nameEls) el.setCustomValidity("");
            return false;
        }
        for (const el of nameEls) el.setCustomValidity("");
        return true;
    },
};
