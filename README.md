# :eye:

...

## Local HTTPS

Run the following command for TLS/SSL:

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

Use `127.0.0.1` as value for Common name and add certificate your store or browser.
