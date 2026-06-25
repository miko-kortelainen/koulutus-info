import fs from "fs";

export const readPublicData = (file: string) =>
  JSON.parse(fs.readFileSync(`${process.cwd()}/public/data/${file}`, "utf-8"));
