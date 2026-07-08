function isEmpty(value) {
    return !value || value.trim() === '';
}

function userCredentialsValidation(email, password) {
    return ( // <-- Added the missing return
        email &&
        email.includes('@') &&
        password &&
        password.trim().length >= 6
    );
}

function userDetailsValidation(email, password, fullname, street, postalCode, city) { // Fixed typo
    return (
        userCredentialsValidation(email, password) &&
        !isEmpty(fullname) &&
        !isEmpty(street) &&
        !isEmpty(postalCode) &&
        !isEmpty(city)
    );
}

function emailValidation(email, confirmEmail) {
    return email === confirmEmail;
}

module.exports = {
    userCredentialsValidation: userCredentialsValidation,
    userDetailsValidation: userDetailsValidation, 
    emailValidation: emailValidation
};