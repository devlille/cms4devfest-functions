import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import findOneFromConferenceHall from './editions/functions/find-one-from-conference-hall';
import findAllActivePartners from './partners/functions/find-all-active-partners';
import makeBillingForPartner from './partners/functions/make-billing-for-partner';

import findAllActiveSpeakers from './speakers/functions/find-all-active-speakers';
import findAllSpeakersFromConferenceHall
    from './speakers/functions/find-all-speakers-from-conference-hall';
import findAllActiveTalks from './talks/functions/find-all-active-talks';
import extractAttendees from './editions/functions/extract-attendees'

admin.initializeApp();

exports.findAllActivePartners = functions.https.onRequest(findAllActivePartners);
exports.makeBillingForPartner = functions.firestore.document('partners/{partnerId}').onCreate(makeBillingForPartner);

exports.findAllActiveSpeakers = functions.https.onRequest(findAllActiveSpeakers);
exports.findAllSpeakersFromConferenceHall = functions.https.onCall(findAllSpeakersFromConferenceHall);

exports.findAllActiveTalks = functions.https.onRequest(findAllActiveTalks);

exports.findOneFromConferenceHall = functions.https.onCall(findOneFromConferenceHall);
exports.extractAttendees = functions.https.onRequest(extractAttendees);