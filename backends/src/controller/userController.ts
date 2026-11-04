import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/user";
import { Hirer } from "@/entity/hirer";
import { Vendor } from "@/entity/vendor";
import {
    backendPhoneNumberValidation,
    backendValidateEmail,
    backendValidatePassword} from "@/utilis/backendValidation";
import { comparePassword, hashPassword } from "@/utilis/passwordHash";

export class UserController {
    private userRepository = AppDataSource.getRepository(User);

    async all(request: Request, response: Response) {
        const users = await this.userRepository.find();
        return response.json(users);
    }

    async one(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const user = await this.userRepository.findOne({
            where: { id },
        });

        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        return response.json(user);
    }

    async login(request: Request, response: Response) {
        const {email, password} = request.body;

        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            return response.status(401).json({ message: "Invalid email or password" });
        }

        let isPasswordValid = false;

        // checks if password is already hashed
        if (user.password.startsWith("$2")) {
            isPasswordValid = await comparePassword(password, user.password);
        } else {
            isPasswordValid = user.password === password;
            if (isPasswordValid) {
                user.password = await hashPassword(password);
                await this.userRepository.save(user);
            }
        }

        if (!isPasswordValid) {
            return response.status(401).json({ message: "Invalid email or password" });
        }

        return response.json(user);
    }

    async save(request: Request, response: Response) {
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            role,
        } = request.body;


        console.log("Register request body:", request.body);

        // backend email check
        const emailValidation = backendValidateEmail(email);
        if (!emailValidation.isValid) {
            return response.status(400).json({ message: emailValidation.errors[0] });
        }

        // backend phone check
        const phoneValidation = backendPhoneNumberValidation(phoneNumber);
        if (!phoneValidation.isValid) {
            return response.status(400).json({ message: phoneValidation.errors[0] });
        }

        // backend role check
        if (!["hirer", "vendor"].includes(role)) {
            return response.status(400).json({ message: "Please select a valid role" });
        }

        // backend password validation
        const pwValidation = backendValidatePassword(password);
        if (!pwValidation.isValid) {
            return response.status(400).json(
                {
                    message: pwValidation.errors.join(", "),
                    errors: pwValidation.errors
                });
        }

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            return response.status(409).json({ message: "Email already in use" });
        }

        // hash password before saving
        const passwordHash = await hashPassword(password);

        const user = Object.assign(new User(), {
            firstName,
            lastName,
            email,
            password: passwordHash,
            phoneNumber,
            role,
            rating: role === "hirer" ? 0 : null,
            createdAt: new Date(),
        });

        try {
            const savedUser = await this.userRepository.save(user);

            if (role === "hirer") {
                const hirerRepository = AppDataSource.getRepository(Hirer);

                const hirer = Object.assign(new Hirer(), {
                    userID: savedUser.id,
                    driverLicenseDoc: "",
                    insuranceDoc: "",
                    registrationDoc: "",
                });

                await hirerRepository.save(hirer);

            } else if (role === "vendor") {
                const vendorRepository = AppDataSource.getRepository(Vendor);

                const vendor = Object.assign(new Vendor(), {
                    userID: savedUser.id,
                });

                await vendorRepository.save(vendor);
            }

            return response.status(201).json(savedUser);
        } catch (error) {
            return response.status(400).json({ message: "Error creating user", error });
        }
    }

    async remove(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const userToRemove = await this.userRepository.findOne({
            where: { id },
        });

        if (!userToRemove) {
            return response.status(404).json({ message: "User not found" });
        }

        await this.userRepository.remove(userToRemove);
        return response.json({ message: "User removed successfully" });
    }

    async update(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            role,
            rating } = request.body;

        let userToUpdate = await this.userRepository.findOne({
            where: { id },
        });

        if (!userToUpdate) {
            return response.status(404).json({ message: "User not found" });
        }

        // handles password update
        let nextPassword = userToUpdate.password;
        if (typeof password === "string" && password.length > 0) {
            const pwValidation = backendValidatePassword(password);
            if (!pwValidation.isValid) {
                return response.status(400).json(
                    {
                        message: pwValidation.errors.join(", "),
                        errors: pwValidation.errors
                    });
            }
            nextPassword = await hashPassword(password);
        }

        userToUpdate = Object.assign(userToUpdate, {
            firstName,
            lastName,
            email,
            password: nextPassword,
            phoneNumber,
            role,
            rating
        });

        try {
            const updatedUser = await this.userRepository.save(userToUpdate);
            return response.json(updatedUser);
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error updating user", error });
        }
    }
}