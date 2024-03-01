const api = (res, statusCode, message, data = null) => {
    if (statusCode >= 200 && statusCode < 400) {
        return res.status(statusCode).json({
            success: true,
            message: message,
            data: data
        });
    } else {
        // Handle error 
        return res.status(statusCode).json({
            success: false,
            error: message,
            data: data
        });
    }
};

module.exports = api;