class AppError extends Error {
    constructor(message, status) {
        super();
        this.message = message || 'Something went wrong';
        this.status = status || 501;

        Error.captureStackTrace(this, this.contructor);
    }
}

module.exports = AppError;
