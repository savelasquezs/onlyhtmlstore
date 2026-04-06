/**
 * Form validation helpers (native constraints + custom rules)
 */
export const FormValidation = {
    personNameIssue(value) {
        const t = String(value).trim();
        if (t.length < 3) return "Usa al menos 3 caracteres.";
        if (t.length > 80) return "Máximo 80 caracteres.";
        if (/^\d+$/.test(t)) return "No puede ser solo números.";
        return "";
    },

    normalizePhoneField(inputEl) {
        if (!inputEl) return;
        inputEl.value = inputEl.value.replace(/\D/g, "");
    },

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
