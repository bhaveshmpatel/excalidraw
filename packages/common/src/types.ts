import { string, z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string(),
    password: z.string().min(6),
    name: z.string()
})

export const SiginSchema = z.object({
    username: z.string(),
    password: z.string().min(6),
})

export const CreateRoomSchema = z.object({
    name: z.string()
})