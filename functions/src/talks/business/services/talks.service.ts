import * as admin from 'firebase-admin';

class TalksService {

    public findAllActiveByEditionId(editionId: string): Promise<any> {
        return admin.firestore()
            .collection('talks')
            .where('edition', '==', editionId)
            .get()
            .then(query => {
                const talks = {};
                query.forEach(doc => talks[doc.id] = doc.data());
                return talks;
            });
    }

}

export default new TalksService();
