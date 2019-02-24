import * as cors from 'cors';
import editionsService from '../../editions/business/services/editions.service';

import speakersService from '../business/services/speakers.service';

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
            .then(() => speakersService.findAllActiveByEditionId(editionId))
            .then(speakers => {
                const limitedSpeakers = {};

                Object.keys(speakers).forEach(key => {
                    limitedSpeakers[key] = {
                        name: speakers[key].name,
                        profileUrl: speakers[key].profileUrl,
                        company: speakers[key].company,
                        bio: speakers[key].bio,
                        github: speakers[key].github,
                        twitter: speakers[key].twitter
                    };
                });

                return limitedSpeakers;
            })
            .then(speakers => response.send(speakers))
            .catch(err => response.status(500).send({message: err.message}));
    });
};
