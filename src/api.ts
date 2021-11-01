import express, { Request, Response } from "express";
import { getComplements } from "./functions/getComplementaryColors";
export const app = express();

app.use(express.json());

import cors from "cors";
app.use(cors({ origin: true }));

app.post("/colors", (req: Request, res: Response) => {
  const { hslStrings, method }: { hslStrings: string[]; method: string } =
    req.body;

    console.debug(req.body);

  const complements = getComplements(hslStrings, method);

  console.log(complements);

  res.status(200).send(complements);
});
