import * as admin from "firebase-admin";

class EditionsService {

    public findOne(editionId): Promise<any> {
        return admin.firestore()
            .collection('editions')
            .doc(editionId)
            .get()
            .then(edition => {
                if(!edition.exists) {
                    throw new Error(`Edition ${editionId} not found.`)
                }

                return edition.data()
            })
    }

}

export default new EditionsService();
