const snap7 = require("node-snap7");

const client = new snap7.S7Client();

console.log("START");

const connected = client.ConnectTo("192.168.1.10", 0, 1);

console.log("CONNECT RESULT:", connected);

setTimeout(() => {
  console.log("CONNECTED:", client.Connected());

  if (!client.Connected()) {
    console.log("PLC NOT CONNECTED");
    return;
  }

  console.log("PLC CONNECTED");

  // READ M10.0
  client.MBRead(10, 1, function (err, res) {
    if (err) {
      console.log("READ ERROR:", client.ErrorText(err));
      return;
    }

    console.log("RAW BUFFER:", res);

    // baca bit pertama
    const bit = (res[0] & 1) !== 0;

    console.log("M10.0 =", bit);
  });
}, 2000);