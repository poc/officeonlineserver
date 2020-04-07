import { check } from 'express-validator';

const UserValidator = [
    check('username','username is required and must have atleast minimum 3 characters').exists().isLength({ min: 3 }),
];

export default UserValidator;