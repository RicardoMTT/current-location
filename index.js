import express from "express";
const app = express();
import axios from 'axios';
/*
El encabezado "X-Forwarded-For" es un encabezado HTTP utilizado por los proxies o balanceadores 
de carga para transmitir la dirección IP original del cliente al servidor final.
*/
app.set("trust proxy", true);//Para obtener el ip, se utilizará el valor del encabezado "X-Forwarded-For" para determinar la dirección IP del cliente cuando se acceda a req.ip


app.get("/", async (req, res) => {
    const ip = req.ip;
    const apiKey = process.env.IPSTACK_API_KEY; // Obtiene la clave de API https://ipstack.com/dashboard desde un archivo .env
    const url = `http://api.ipstack.com/${ip}?access_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const { latitude, longitude } = response.data;
        const url_geocode_client = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        const response_accuracy = await axios.get(url_geocode_client);
        res.send(response_accuracy.data);
    } catch (error) {
        res.status(500).send('Error al obtener la ubicación');
    }

});

app.listen(3000, () => {
    console.log("SERVER RUNNIHG AT PORT 3000");
});