import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_SECRET)

    if((decoded as JwtPayload).userId) {
        next();
    } else {
        res.status(411).json({
            msg: "Unauthorized user"
        })
    }
}