import * as cors from 'cors';
import editionsService from '../../editions/business/services/editions.service';
import * as  functions  from 'firebase-functions';

function disableCors(request, callback) {
    callback(null, true);
}
export default (request, response) => {
    cors(disableCors)(request, response, () => {
        const {billetWebEventId} = request.body;

        if (billetWebEventId === undefined) {
            response.status(400).send({message: 'Required billetWebEventId field in the request.'});
        }
       
        return editionsService.extractAttendees(billetWebEventId, functions.config().billetweb.prefix)
            .then(attendees => {
                response.setHeader(
                    "Content-disposition",
                    "attachment; filename=attendees.csv"
                  )
                  response.set("Content-Type", "text/csv")
                  response.send(attendees)
            })
            .catch(err => response.status(500).send({message: err.message}));
    });
}
