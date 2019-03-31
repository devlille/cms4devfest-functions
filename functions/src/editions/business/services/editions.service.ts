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
        return fetch(`https://conference-hall.io/api/v1/event/${editionId}?key=${apiKey}&state=${state}`)
            .then(res => res.json())
            .then(res => {
                res.speakers.forEach(speaker => {
                    speaker.uidFromConferenceHall = speaker.uid;
                    delete speaker.uid;
                });

                res.talks.forEach(talk => {
                    talk.uidFromConferenceHall = talk.id;
                    delete talk.id;

                    talk.categories = res.categories.find(category => category.id === talk.categories);
                    talk.formats = res.formats.find(format => format.id === talk.formats);
                });

                return {
                    speakers: res.speakers,
                    talks: res.talks
                };
            })
    }

}

export default new EditionsService();
