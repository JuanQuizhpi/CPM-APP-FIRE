import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"cpm-app-b08cd","appId":"1:308925742563:web:b175fd3e7e826db62274d6","storageBucket":"cpm-app-b08cd.firebasestorage.app","apiKey":"AIzaSyDTG7rfqcHcZLSO4P-p0XZKWTa3cncJ7eo","authDomain":"cpm-app-b08cd.firebaseapp.com","messagingSenderId":"308925742563"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideMessaging(() => getMessaging())]
};
