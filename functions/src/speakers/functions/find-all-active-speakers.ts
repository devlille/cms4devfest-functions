import * as cors from 'cors';
import editionsService from '../../editions/business/services/editions.service';

import speakersService from '../business/services/speakers.service';

function disableCors(request, callback) {
    callback(null, true);
}

export default (request, response) => {
    cors(disableCors)(request, response, () => {
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
                        displayName: speakers[key].displayName,
                        role: speakers[key].role,
                        photoURL: speakers[key].photoURL,
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
