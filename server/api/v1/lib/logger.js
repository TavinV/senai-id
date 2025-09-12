import winston from 'winston'
import path from 'path'
const { errors, combine, timestamp, json } = winston.format

const logsFilePath = path.resolve("./logs")
const info = path.join(logsFilePath, 'info.log')
const exceptions = path.join(logsFilePath, 'exception.log')
const rejections = path.join(logsFilePath, 'rejection.log')

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [
        new winston.transports.File({ filename: info }),
        new winston.transports.Console({
            format: combine(timestamp(), errors({ stack: true }), winston.format.simple())
        })],
    exceptionHandlers: [new winston.transports.File({ filename: exceptions })],
    rejectionHandlers: [new winston.transports.File({ filename: rejections })],
})

export default logger