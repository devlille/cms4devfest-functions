import * as cors from 'cors';
import editionsService from '../../editions/business/services/editions.service';
import speakersService from '../../speakers/business/services/speakers.service';

import talksService from '../business/services/talks.service';

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
            .then(() => Promise.all([talksService.findAllActiveByEditionId(editionId), speakersService.findAllActiveByEditionId(editionId)]))
            .then(datas => {
                const limitedTalks = {};

                Object.keys(datas[0]).forEach(key => {
                    const time = new Date(datas[0][key].hour.seconds * 1000);

                    limitedTalks[key] = {
                        title: datas[0][key].title,
                        abstract: datas[0][key].abstract,
                        level: datas[0][key].level,
                        format: datas[0][key].formats !== null ? datas[0][key].formats.name : '',
                        category: datas[0][key].categories !== null ? datas[0][key].categories.name : '',
                        hour: `${time.getHours()}:${time.getSeconds()}`,
                        room: datas[0][key].room,
                        speakers: Object.keys(datas[0][key].speakers).map(speakerId => datas[1][speakerId].displayName)
                    };
                });

                return limitedTalks;
            })
            .then(talks => response.send(talks))
            .catch(err => response.status(500).send({message: err.message}));
    });
};
