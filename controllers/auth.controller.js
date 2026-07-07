const Users = require('../models/user.model'); // ✅ Correct import
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res, next) {
    let sessionData = sessionFlash.getFlashData(req);
    if (!sessionData) {
        sessionData = {
            email: '',
            confirmEmail: '', // Fixed capitalization
            fullName: '',     // Fixed capitalization
            street: '',
            postalCode: '',   // Fixed capitalization
            city: '',
            password: '',
        };
    }

    try {
        res.render('customers/auth/signup', { inputdata: sessionData });
    } catch (error) {
        next(error);
    }
}

async function Signup(req, res, next) {
    const enteredData = {
        email: req.body.Email,
        confirmEmail: req.body['Confirm-Email'],
        password: req.body.Password,
        fullName: req.body.FullName,
        street: req.body.Street,
        postalCode: req.body.PostalCode,
        city: req.body.City
    };

    if (!validation.userCredentialsValidation(req.body.Email, req.body.Password, req.body.FullName, req.body.Street, req.body.PostalCode, req.body.City) ||
        !validation.emailValidation(req.body['Confirm-Email'], req.body.Email)) {
        sessionFlash.flashDatatoSession(req, {
            errorMessage: 'Invalid input',
            ...enteredData
        }, function() {
            res.redirect('/signup');
        });
        return;
    }

    const user = new Users(
        req.body.Email,
        req.body.Password,
        req.body.FullName,
        req.body.Street,
        req.body.PostalCode,
        req.body.City
    );

    try {
        const existingUser = await user.existsAlready();
        if (existingUser) {
            sessionFlash.flashDatatoSession(req, {
                errorMessage: 'User already exists',
                ...enteredData
            }, function() {
                res.redirect('/signup');
            });
            return;
        }

        await user.signup(); // ✅ Fix missing `await`
    } catch (error) {
        next(error);
        return;
    }
    res.redirect('/login');
}

function getLogin(req, res, next) {
    let sessionData = sessionFlash.getFlashData(req);
    if (!sessionData) {
        sessionData = {
            email: '',
            password: ''
        };
    }
    try {
        res.render('customers/auth/login', { inputdata: sessionData });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    const user = new Users(req.body.Email, req.body.Password);
    try {
        const existingUser = await user.getuserWithSameEmail();

        const sessionErrorData = {
            errorMessage: 'Invalid email or password',
            email: user.email,  // ✅ Fix variable name
            password: user.password
        };

        if (!existingUser) {
            sessionFlash.flashDatatoSession(req, sessionErrorData, function() {
                res.redirect('/login');
            });
            return;
        }

        const passwordIsCorrect = await user.passwordIsCorrect(existingUser.password);
        if (!passwordIsCorrect) {
            sessionFlash.flashDatatoSession(req, sessionErrorData, function() {
                res.redirect('/login');
            });
            return;
        }

        authUtil.CreateUserSession(req, existingUser, function() {
            res.redirect('/');
        });
    } catch (error) {
        next(error);
    }
}

function logout(req, res, next) {
    try {
        authUtil.DestroyUserSession(req, function() {
            res.redirect('/login');
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getSignup,
    getLogin,
    Signup,
    login,
    logout
};
