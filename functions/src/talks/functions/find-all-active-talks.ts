import * as cors from 'cors';
import editionsService from '../../editions/business/services/editions.service';
import speakersService from '../../speakers/business/services/speakers.service';

import talksService from '../business/services/talks.service';

function disableCors(request, callback) {
    callback(null, true);
}

export default (request, response) => {
    cors(disableCors)(request, response, () => {
        const editionId = request.query.editionId;
        const roomId = request.query.roomId;
        console.log('editionId', editionId);
        console.log('roomId', roomId);

        if (editionId === undefined) {
            response.status(400).send({message: 'Required editionId field in the request.'});
        }

        return editionsService.findOne(editionId)
            .then(() => Promise.all([talksService.findAllActiveByEditionId(editionId, roomId), speakersService.findAllActiveByEditionId(editionId)]))
            .then(datas => {
                const limitedTalks = {};

                Object.keys(datas[0]).forEach(key => {
                    limitedTalks[key] = {
                        title: datas[0][key].title,
                        abstract: datas[0][key].abstract,
                        level: datas[0][key].level,
                        format: datas[0][key].formats && datas[0][key].formats !== null ? datas[0][key].formats.name : '',
                        category: datas[0][key].categories && datas[0][key].categories !== null ? datas[0][key].categories.name : '',
                        hour: datas[0][key].hour,
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
