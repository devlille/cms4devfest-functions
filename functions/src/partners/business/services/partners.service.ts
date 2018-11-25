import * as admin from 'firebase-admin';

class PartnersService {

    public findAllActiveByEditionId(editionId: string): Promise<any> {
        return admin.firestore()
            .collection('partners')
            .where('edition', '==', editionId)
            .where('activeOn', '<=', new Date().getTime())
            .get()
            .then(query => {
                const partners = {};
                query.forEach(doc => partners[doc.id] = doc.data());
                return partners
            });
    }

}

export default new PartnersService();
