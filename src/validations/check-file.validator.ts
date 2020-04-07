import { check } from 'express-validator';

const CheckfileValidator = [
    check('OwnerId').exists().isLength({ min: 3 }),
    check('UserId').exists().isLength({ min: 3 }),
    check('UserFriendlyName').exists().isLength({ min: 3 }),
    check('BaseFileName').exists().isLength({ min: 3 }),
    check('Size').exists().isLength({ min: 1 }),
    check('Version').exists().isLength({ min: 1 }),
    check('UserInfo').exists().isLength({ min: 3 }),
];

export default CheckfileValidator;