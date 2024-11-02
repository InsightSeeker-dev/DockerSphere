// scripts/setup-ovh.js
const ovh = require('ovh');

// Création des credentials
const credentials = {
  endpoint: 'ovh-eu',
  applicationKey: 'votre_app_key',
  applicationSecret: 'votre_app_secret'
};

const client = ovh(credentials);

// Demande des droits d'accès
client.request('POST', '/auth/credential', {
  'accessRules': [
    { 'method': 'GET', 'path': '/domain/zone/*' },
    { 'method': 'POST', 'path': '/domain/zone/*' },
    { 'method': 'DELETE', 'path': '/domain/zone/*' }
  ]
}, (error, credential) => {
  if (error) {
    console.error('Erreur:', error);
    return;
  }
  
  console.log('Veuillez visiter cette URL pour valider les droits:', credential.validationUrl);
  console.log('Votre consumerKey:', credential.consumerKey);
});
