import * as functions from 'firebase-functions';
import editionsService from '../../editions/business/services/editions.service';

export default (data, context) => {
    const editionId = data.editionId;
    const state = data.state;
    console.log('editionId', editionId);
    console.log('state', state);

    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to access this resource.');
    }

    if (editionId === undefined) {
        throw new functions.https.HttpsError('invalid-argument', 'Required editionId field in the request.');
    }

    return editionsService.findOne(editionId)
        .then(edition => editionsService.findOneFromConferenceHall(edition.conferenceHall.eventId, edition.conferenceHall.apiKey, state));
};
