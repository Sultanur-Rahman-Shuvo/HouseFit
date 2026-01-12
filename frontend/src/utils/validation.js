export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validatePhone = (phone) => {
    const re = /^01[0-9]{9}$/;
    return re.test(phone);
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};
