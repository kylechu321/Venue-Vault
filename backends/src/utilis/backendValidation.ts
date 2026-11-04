export interface BackendValidationInterface {
    isValid: boolean;
    errors: string[];
}

export function backendValidatePassword(password: string): BackendValidationInterface {
    const errors: string[] = [];

    if (password.length < 6) {
        errors.push("At least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("At least 1 uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("At least 1 lowercase letter");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("At least 1 special character");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function backendPhoneNumberValidation(phoneNumber: string): BackendValidationInterface {
    const errors: string[] = [];

    if (phoneNumber.trim().length === 0) {
        errors.push("Phone number is required");
    } else if (!/^04\d{8}$/.test(phoneNumber)) {
        errors.push("Must be a valid Australian mobile number (e.g. 0412345678)");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}


export function backendValidateEmail(email: string): BackendValidationInterface {
    const errors: string[] = [];

    if (email.trim().length === 0) {
        errors.push("Email is required");
    } else {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Must be a valid email format");
        }
        if (!email.endsWith("@rmit.edu.au")) {
            errors.push("Must be an RMIT email address (@rmit.edu.au)");
        }
    }


    return {
        isValid: errors.length === 0,
        errors
    };
}