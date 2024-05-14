require("dotenv").config();

export default function tokenIsValid(token: string) {
  const SECRET_KEY = process.env.SECRET_KEY;

  if (!SECRET_KEY) {
    console.error("SECRET_KEY is undefined. Check the .env");
  }
  if (token === SECRET_KEY) return true;

  return false;
}
