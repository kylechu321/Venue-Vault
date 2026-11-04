import {
    backendValidateEmail,
    backendValidatePassword,
    backendPhoneNumberValidation } from "../../utilis/backendValidation";

// TEST SUITE 1: Email Validation
// and rejects non-RMIT or malformed email addresses.
describe("backendValidateEmail", () => {
    // Test 1: Valid RMIT email should produce no errors
    it("should produce no errors for a valid RMIT email address", () => {
        const result = backendValidateEmail("s1234567@rmit.edu.au");
        expect(result.errors).toHaveLength(0);
    });

    // Test 2: Non-RMIT email should produce errors
    it("should produce errors for a non-RMIT email address", () => {
        const result = backendValidateEmail("user@gmail.com");
        expect(result.errors.length).toBeGreaterThan(0);
    });

    // Test 3: Empty email should produce errors
    it("should produce errors for an empty email string", () => {
        const result = backendValidateEmail("");
        expect(result.errors.length).toBeGreaterThan(0);
    });
});

//Password Validation
// at least 1 uppercase, 1 lowercase, 1 special character, and min 6 chars.
describe("backendValidatePassword", () => {
    // Test 4: Valid complex password should produce no errors
    it("should produce no errors for a password that meets all complexity requirements", () => {
        const result = backendValidatePassword("Secret@1");
        expect(result.errors).toHaveLength(0);
    });

    // Test 5: Password without special character should produce errors
    it("should produce errors for a password missing a special character", () => {
        const result = backendValidatePassword("Secret1");
        expect(result.errors.length).toBeGreaterThan(0);
    });

    // Test 6: Password shorter than 6 characters should produce errors
    it("should produce errors for a password shorter than 6 characters", () => {
        const result = backendValidatePassword("Ab@1");
        expect(result.errors.length).toBeGreaterThan(0);
    });
});

//Phone Number Validation
// Australian mobile numbers (must start with 04 and be 10 digits).
describe("backendPhoneNumberValidation", () => {
    // Test 7: Valid Australian mobile number should produce no errors
    it("should produce no errors for a valid Australian mobile number", () => {
        const result = backendPhoneNumberValidation("0412345678");
        expect(result.errors).toHaveLength(0);
    });

    // Test 8: Phone number that is too short should produce errors
    it("should produce errors for a phone number that is too short", () => {
        const result = backendPhoneNumberValidation("041234");
        expect(result.errors.length).toBeGreaterThan(0);
    });

    // Test 9: Phone number not starting with 04 should produce errors
    it("should produce errors for a phone number not starting with 04", () => {
        const result = backendPhoneNumberValidation("0312345678");
        expect(result.errors.length).toBeGreaterThan(0);
    });
});
