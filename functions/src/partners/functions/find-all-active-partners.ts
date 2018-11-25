import * as cors from 'cors';

import partnersService from '../business/services/partners.service';
import editionsService from '../../editions/business/services/editions.service';

function checkOrigin(request, callback) {
    const editionId = request.query.editionId;
    const origin = request.header('Origin');

    editionsService.findOne(editionId)
        .then(edition => `https://${edition.url}` === origin ? callback(null, { origin: true }) : callback(null, { origin : false }))
        .catch(err => callback(err, { origin: false }));
}

export default (request, response) => {
    cors(checkOrigin)(request, response, () => {
        const editionId = request.query.editionId;

        if(editionId === undefined) {
            response.status(400).send({ message: 'Required editionId field in the request.'});
        }

        return editionsService.findOne(editionId)
            .then(() => partnersService.findAllActiveByEditionId(editionId))
            .then(partners => response.send(partners))
            .catch(err => response.status(500).send({ message: err.message }));
    });
};
