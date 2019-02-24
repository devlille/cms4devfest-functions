import * as cors from 'cors';
import editionsService from '../../editions/business/services/editions.service';
import partnersService from '../business/services/partners.service';

function checkOrigin(request, callback) {
    const editionId = request.query.editionId;
    const origin = request.header('Origin');

    editionsService.findOne(editionId)
        .then(edition => `https://${edition.url}` === origin ? callback(null, {origin: true}) : callback(null, {origin: false}))
        .catch(err => {
            console.error('checkOrigin', err);
            callback(err, {origin: false});
        });
}

export default (request, response) => {
    cors(checkOrigin)(request, response, () => {
        const editionId = request.query.editionId;
        console.log('editionId', editionId);

        if (editionId === undefined) {
            response.status(400).send({message: 'Required editionId field in the request.'});
        }

        return editionsService.findOne(editionId)
            .then(() => partnersService.findAllActiveByEditionId(editionId))
            .then(partners => {
                const limitedPartners = {};

                Object.keys(partners).forEach(key => {
                    limitedPartners[key] = {
                        name: partners[key].name,
                        url: partners[key].url,
                        logoUrl: partners[key].logoUrl,
                        level: partners[key].level
                    };
                });

                return limitedPartners;
            })
            .then(partners => response.send(partners))
            .catch(err => response.status(500).send({message: err.message}));
    });
};
