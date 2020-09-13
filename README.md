# Flow of Four :eye:

[Js13kGames](https://js13kgames.com/)

###### #4o4

2020.

> Release in this branch is a work in progress, I'm going to continue in a separated branch.
> Keep this for the gamejam, there are a few seconds of fun, if you are interested in an earlier (and better)
> stage [click here to run](https://subztep.github.io/js13k-2020/old.html)

---

## Game Controls

Left joystick for all directions is moving.

Right joystick only for x angles rotate.

Grab and Trigger for the birds (depends).

## What Without RIG

Tested only with **Oculus Rift** and its **Touch Controller**. Certainly PC, **GTX 1070** and on **Chrome**, but it was okay on Firefox as well with quite a bit performance differences. Maybe runs on different platforms, not sure, nevertheless it's not intended to run in a non-virtual environment.

### Without _working_ VR headset

Find quickly the `NoVR` button on the bottom-left corner right after page-load to able to visit scenes without ~~interactive~~ experience.

### Without _working_ controller

Use mouse for looking around and the keys below.

|    Key    | Event                            |
| :-------: | -------------------------------- |
|     w     | e                                |
|     a     | g                                |
|     s     |
|     d     |
|     q     | Turn left a slice                |
|     Q     | Continuous turn left             |
|     e     | T                                |
|     E     | R                                |
|           |
| :godmode: | **Debug**                        |
|     c     | Toggle camera to 3rd person view |
|     n     | Load next thingie/happening      |

---

## Local Setup

Run `npm install`, this command copy _A-Frame_ developer bundle to the `dist` folder.

## Oculus Rift with _Google_ Chrome

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
