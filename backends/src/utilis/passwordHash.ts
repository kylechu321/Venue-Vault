import bcrypt from 'bcrypt';

/* Reference to using bcrypt: Add Salt to Hashing: 
A Better Way to Store Passwords | Auth0. (2018). Auth0 - Blog. 
https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/#Simplifying-Password-Management-with-Auth0*/

const SALT = 10;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};