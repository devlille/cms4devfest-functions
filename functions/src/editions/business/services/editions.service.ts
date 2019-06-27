import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

class EditionsService {

    public findOne(editionId: string): Promise<any> {
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

    public findOneFromConferenceHall(editionId, apiKey, state = 'confirmed'): Promise<any> {
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
            });
    }

    public extractAttendees(billetWebId: string, billetWebPrefix: string): Promise<any> {
        function ticketToCategory(ticket){
            if(ticket === 'SPEAKER' || ticket === 'BENEVOLE' || ticket === 'ORGANISATEUR' || ticket === 'STAND'){
                return ticket
            }
            return "PARTICIPANT"
        }
        return fetch(`https://www.billetweb.fr/api/event/${billetWebId}/attendees?${billetWebPrefix}`)
        .then(res => res.json())
        .then(attendees => {
            return attendees
                .map(attendee => [attendee.firstname.charAt(0).toUpperCase() + attendee.firstname.slice(1)  + ' ' + attendee.name.toUpperCase(), attendee.custom.Entreprise.toUpperCase(), ticketToCategory(attendee.ticket)].join(';'))
                .join('\n')
        })
    }

}

export default new EditionsService();
