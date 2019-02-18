import * as admin from 'firebase-admin';

class SpeakersService {

    public findAllActiveByEditionId(editionId: string): Promise<any> {
        return admin.firestore()
            .collection('speakers')
            .where('edition', '==', editionId)
            .get()
            .then(query => {
                const speakers = {};
                query.forEach(doc => speakers[doc.id] = doc.data());
                return speakers
            });
    }

}

export default new SpeakersService();
