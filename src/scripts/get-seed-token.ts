// to be run with seed env file .env.seed

import axios from "axios";
import "dotenv/config";

async function main() {
  const response = await axios.post(
    `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
    null,
    {
      params: {
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        code: process.env.ZOHO_GRANT_CODE,
        grant_type: "authorization_code",
      },
    }
  );

  console.log("Refresh token:", response.data.refresh_token);
}

main().catch((error) => {
  console.error(
    "Token generation failed:",
    error.response?.data ?? error.message
  );
});