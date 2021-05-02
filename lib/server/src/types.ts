import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { Request, Response } from 'express'

export interface MyContext {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
  redis: Redis;
}