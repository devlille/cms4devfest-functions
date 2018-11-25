import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import findAllActivePartners from './partners/functions/find-all-active-partners';

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

exports.findAllActivePartners = functions.https.onRequest(findAllActivePartners);
