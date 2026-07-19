export class ApiError extends Error {
    constructo(message,statusCode){
        super(message);
        this.statusCode = statusCode
        this.status= `${statusCode}`.startsWith('4') ? 'fail':'error'
        this.isOperational = true //optional

        Error.captureStackTrace(this,this.constructo);
    }
}


export const catchAsync = (fn) => {
    return (req,res,next) => {
        fn(req,res,next).catch(next)
    }
}

//handle jwt error
    export const handleJWTError = () => {
        new ApiError('Invalid token . Please log in again',401)
    }
