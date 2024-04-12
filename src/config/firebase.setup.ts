import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as admin from 'firebase-admin';
let app: admin.app.App = null;
@Injectable()
export class FirebaseAdmin implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    if (!app) {
      const adminConfig: admin.ServiceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };

      app = admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
      });
    }
  }
  setup() {
    return app;
  }
}
