export const designDocumentUrl = (dbName: string) => `http://admin:admin@${process.env.COUCHDB_URL}/${dbName}/_design/validation`;

export const designDocumentId = '_design/validation';