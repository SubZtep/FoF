# Flow of Four :eye:

[Js13kGames](https://js13kgames.com/)

###### #4o4

2020.

---

## Game Controls

## What Without RIG

Tested only with **Oculus Rift** and its **Touch Controller**.

Certainly PC, **GTX 1070** and on (a surprisingly overperform other browsers) **Chrome**, but it was okay on Firefox as well. Maybe runs on different platforms but I can't be sure.

### Without _working_ VR headset

Find quickly the `NoVR` button on the bottom-left corner, right after pageload to able to visit scenes without interactive experience.

### Without _working_ controller

| Key | Event                            |
| :-: | -------------------------------- |
|  q  | Turn left a slice                |
|  Q  | Continuous turn left             |
|     |
|  c  | Toggle camera to 3rd person view |
|  n  | Load next thingie/happening      |

---

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
