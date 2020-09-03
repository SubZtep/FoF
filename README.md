# :eye:

...

## Local Setup

Run `npm install`, this command copy _A-Frame_ developer bundle to the `dist` folder.

## Oculus Rift with Google Chrome

Be sure no Chrome instances are running and start the browser with the following command-line options:

```
--enable-features=oculus --disable-features=XRSandbox --force-webxr-runtime=oculus
```

## Local HTTPS

Run the following command for TLS/SSL:

```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

Use `127.0.0.1` as value for Common name and add certificate your store or browser.
