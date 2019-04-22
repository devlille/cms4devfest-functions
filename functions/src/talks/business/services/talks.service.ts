import * as admin from 'firebase-admin';

class TalksService {

    public findAllActiveByEditionId(editionId: string, roomId?: string): Promise<any> {
        return admin.firestore()
            .collection('talks')
            .where('edition', '==', editionId)
            .orderBy('hour', 'asc')
            .get()
            .then(query => {
                const talks = {};
                query.forEach(doc => talks[doc.id] = doc.data());
                return talks;
            })
            .then(talks => {
                if (roomId) {
                    const filteredTalks = {};
                    Object.keys(talks).forEach(talkId => {
                        if(talks[talkId].room === roomId) {
                            filteredTalks[talkId] = talks[talkId];
                        }
                    });

                    return filteredTalks;
                }

                return talks;
            });
    }

}

export default new TalksService();
