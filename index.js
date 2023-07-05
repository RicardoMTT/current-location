import express from "express";
import { SuperfaceClient } from "@superfaceai/one-sdk";
const app = express();
app.set("trust proxy", true);

const sdk = new SuperfaceClient();

async function run(ip) {
    // Load the profile
    const profile = await sdk.getProfile("address/ip-geolocation@1.0.1");

    // Use the profile
    const result = await profile.getUseCase("IpGeolocation").perform(
        {
            ipAddress: ip
        },
        {
            provider: "ipdata",
            security: {
                apikey: {
                    apikey: "6896356236c7f86d47aea71f327c03f0c00ce736e143d29373c2613f"
                }
            }
        }
    );

    // Handle the result
    try {
        const data = result.unwrap();
        return data;
    } catch (error) {
        console.error(error);
    }
}

app.get("/", async (req, res) => {
    res.send(await run(req.ip));
});

app.listen(3000, () => {
    console.log("SERVER RUNNIHG AT PORT 3000");
});