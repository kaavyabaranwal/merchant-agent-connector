import axios from "axios";
import "dotenv/config";

async function getAccessToken(): Promise<string> {
  const response = await axios.post(
    `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
    null,
    {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    }
  );

  return response.data.access_token;
}

async function getOrganizations() {
  const accessToken = await getAccessToken();

  const response = await axios.get(
    `${process.env.ZOHO_API_URL}/organizations`,
    {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    }
  );

  console.log(JSON.stringify(response.data, null, 2));
}

getOrganizations().catch((error) => {
  console.error(
    "API request failed:",
    error.response?.data ?? error.message
  );
});