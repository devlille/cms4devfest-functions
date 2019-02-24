import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

class EditionsService {

    public findOne(editionId): Promise<any> {
        return admin.firestore()
            .collection('editions')
            .doc(editionId)
            .get()
            .then(edition => {
                if (!edition.exists) {
                    throw new Error(`Edition ${editionId} not found.`);
                }

                return edition.data();
            });
    }

    public findOneOnConferenceHall(editionId, apiKey, state = 'accepted'): Promise<any> {
        return fetch(`https://conference-hall.io/api/v1/event/${editionId}?key=${apiKey}&state=${state}`);
    }

}

export default new EditionsService();
