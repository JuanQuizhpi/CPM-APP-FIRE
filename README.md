# Ciudad Patrimonio Mundial (CPM) 

## Visitar Página

+ https://cpm-app-b08cd.web.app/ 

## Enlace al Manual de uso de la app

+ https://drive.google.com/file/d/1Sb0o8T67iPc8InNsJnG-L2Bqr3rjZlr-/view?usp=sharing

## Comando para ejecución de la aplicación

`ng serve --proxy-config proxy.conf.json`

+ En el repositorio se encontrar el archivo `proxy.conf.json` deberemos tener este archivo ya que con esto podremos hacer uso de la api de resen para enviar correos.

## Entorno de desarrollo del proyecto

+ Versión de Angular

`Angular CLI: 17.3.11`

+ Versión de Node.js

`Node: 18.20.5`

+ Versión de npm

`Package Manager: npm 10.8.2`

## Comandos para Instalar herramienta usadas en el proyecto

+ Para la descargar el archivo en CSV

`npm install --save-dev @types/file-saver`

+ Para intalar angular materials 

`ng add @angular/material`

+ Para instalar SWAL 

`npm install sweetalert2`

+ Para instalar Resend

`npm install resend`

## Construir proyecto y despligue en Firebase Hosting 

### Generar el build de producción

`ng build --configuration=production --prerender=false`

+ Tomar en cuanta que para que la app se construya si problema deberemos entrar al archivo `angular.json` y buscar el apartado de `budgets` y configurar estos valores corespondientes a `"type": "initial"` con lo siguiente `"maximumWarning": "2mb"` y `"maximumError": "3mb"`, De igual forma `"type": "anyComponentStyle"` con `"maximumWarning": "10kb"` y `"maximumError": "20kb"`. Esto garantiza la corresta construcción del proyecto.

+ Recordar que la ruta donde se guardar sera `dist/cpm-app/browser` y se debera servir en firebase el `index.html`

### Primero se debera Iniciar Sesión en firebase

`firebase login`

### Iniciar Firebase en tu proyecto

firebase init hosting

+ Estos son los pasos que se deben seguir para iniciar el proyecto considerar que ya estaremos trabajando con el proyecto antes en firebase

1. Selecciona "Use an existing project" y elige tu app Firebase.
2. Para la carpeta pública, ingresa: `dist/cpm-app/browser/`
3. Cuando pregunte "Configure as a single-page app (rewrite all URLs to /index.html)?" selecciona `Yes`
4. Si pregunta sobre Cloud Functions o SSR, selecciona `No`

###  Desplegar la aplicación en Firebase

+ Ejecuta este comando para subir los archivos a Firebase Hosting

`firebase deploy`

+ Sera normal que por primera vez te aparesca una ventana de firebase eso indica que ya se levanto el hosting pero no tu app ahora si segimos en orden estos pasos levantaremos nuesta app 

1. `ng build --configuration=production --prerender=false`
2. Verificamos que en la carpeta `dist/cpm-app/browser/` el archivo `index.html` este presente y sea referente a nuestra aplicación si es el caso unicamente nos quedad pasar al siguiente paso 
3. `firebase deploy`
