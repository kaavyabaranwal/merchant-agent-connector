import axios from "axios";
import "dotenv/config";

const accountsUrl = "https://accounts.zoho.in";

async function generateTokens() {
  const response = await axios.post(
    `${accountsUrl}/oauth/v2/token`,
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

  console.log("Access token:", response.data.access_token);
  console.log("Refresh token:", response.data.refresh_token);
  console.log("API domain:", response.data.api_domain);
  console.log("Expires in:", response.data.expires_in);
}

generateTokens().catch((error) => {
  console.error(
    "Token generation failed:",
    error.response?.data ?? error.message
  );
});