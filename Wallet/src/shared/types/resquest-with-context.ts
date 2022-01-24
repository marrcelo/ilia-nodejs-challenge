import { Request } from "express";

export type RequestWithContext = Request &
  Partial<{
    context: { user_id: string | (() => string) };
  }>;
