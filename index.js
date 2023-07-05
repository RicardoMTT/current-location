import express from "express";
import { SuperfaceClient } from "@superfaceai/one-sdk";
const app = express();
import axios from 'axios';
 
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
                    apikey: process.env.API_DATA
                }
            }
        }
    );

    // Handle the result
    try {
        const data = result.unwrap();
        console.log('data',data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

app.get("/", async (req, res) => {
    const ip = req.ip;
    console.log(ip);
const apiKey = 'b79bbfc5e7a6c5a1f26a82f7261125ee'; // Obtiene la clave de API desde un archivo .env

const url = `http://api.ipstack.com/${ip}?access_key=${apiKey}`;

axios.get(url)
.then((response) => {
  const { country_name, region_name, city, latitude, longitude } = response.data;

  console.log('País:', country_name);
  console.log('Región:', region_name);
  console.log('Ciudad:', city);
  console.log('Latitud:', latitude);
  console.log('Longitud:', longitude);
})
.catch((error) => {
  console.error('Error al obtener la ubicación:', error.message);
});
    res.send(await run(req.ip));
});

app.listen(3000, () => {
    console.log("SERVER RUNNIHG AT PORT 3000");
});