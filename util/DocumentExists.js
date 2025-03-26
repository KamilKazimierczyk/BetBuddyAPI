const DocumentExists = async (documentId, Model) => {
    const document = await Model.findById(documentId);

    return !document ? false : document;
}

module.exports = DocumentExists;