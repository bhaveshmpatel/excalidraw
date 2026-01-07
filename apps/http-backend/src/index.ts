import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SiginSchema, CreateRoomSchema } from "@repo/common/types";
import { middleware } from "./middleware";

const app = express();
app.use(express.json());

app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
    return;
  }
});

app.post("/signin", (req, res) => {
  const data = SiginSchema.safeParse(req.body);
  if (!data.success) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
    return;
  }

  const username = data.data?.username;

  const token = jwt.sign(username, JWT_SECRET);

  res.json({
    token
  })

});

app.post("/room", (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
    return;
  }
});

app.listen(3001);
