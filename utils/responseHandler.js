export const successResponse = (res, { status = 200, message = 'Data Sent Successfully', payload = {} }) => {
    res.status(status).json({
        success: true,
        message,
        payload,
    });
};

export const errorResponse = (res, { status = 500, message = "Internal Server Error" }) => {
    res.status(status).json({
        success: false,
        message,
    });
};