const AppError = require('../errors/app-error');

class ErrorHelper {
    static error(error) {
        return new AppError(error.message);
    }
}

module.exports = ErrorHelper;
