
const findLocalDevices = require("local-devices");
const axios = require("axios");

main();

async function main() {
  const devices = await findLocalDevices();

  const nanoleafDevice = devices.find((device) => device.name.toLowerCase().includes("nanoleaf") || device.name === "?" );

  if (!nanoleafDevice) {
    console.log(`Failed to find nanoleaf in local network. Make sure it is on and that device name is "Nanoleaf" or simply "?".`);
    return;
  }

  console.log(`Found nanoleaf device in local network`, nanoleafDevice);

  const { ip } = nanoleafDevice;
  const port = "16021";

  
  const response = await axios.post(`http://${ip}:${port}/api/v1/new`).catch(() => false);

  if (!response) {
    console.log(`Failed to get access token, make sure to press and hold the power button until it starts blinking.`);
    return;
  }

  const authToken = response.data.auth_token;

  console.log(`NANOLEAF_HOST=${ip}`);
  console.log(`NANOLEAF_ACCESS_TOKEN=${authToken}`);
}




