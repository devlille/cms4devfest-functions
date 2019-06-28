import * as cors from "cors";
import editionsService from "../../editions/business/services/editions.service";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const getUserFromBearer = async req => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return null;
  }
  const idToken = req.headers.authorization.split("Bearer ")[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    return decodedIdToken;
  } catch (e) {
    return null;
  }
};

function disableCors(request, callback) {
  callback(null, true);
}
export default (request, response) => {
  cors(disableCors)(request, response, async () => {
    const user: admin.auth.DecodedIdToken | any = await getUserFromBearer(
      request
    );
    if (!user) {
      response.status(403).send("Unauthorized");
    }

    const { editionId } = request.body;
    if (editionId === undefined) {
      response
        .status(400)
        .send({ message: "Required editionId field in the request." });
    }
    return editionsService
      .findOne(editionId)
      .then(edition => {
        if (!edition.members[user.uid]) {
          throw new Error('Unauthorized');
        }
        return edition.billetWeb.eventId;
      })
      .then(billetWebEventId => {
        return editionsService.extractAttendees(
          billetWebEventId,
          functions.config().billetweb.prefix
        );
      })
      .then(attendees => {
        response.setHeader(
          "Content-disposition",
          "attachment; filename=attendees.csv"
        );
        response.set("Content-Type", "text/csv");
        response.send(attendees);
      })
      .catch(err => response.status(500).send({ message: err.message }));
  });
};
