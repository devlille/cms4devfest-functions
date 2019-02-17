export default (snap, context) => {
    const partner = snap.data();

    const billingInfos = {
        company: partner.name,
        siret: partner.siret,
        address: partner.address.road,
        cp: partner.address.zipCode,
        city: partner.address.town,
        contact: partner.contact.name,
        role: partner.contact.function,
        sponsoring: partner.level
    };

    // TODO call Manu soft
};