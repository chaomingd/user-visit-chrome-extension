import { serviceWorkerApi } from '../messageApi/serviceWorkerApi';
import { startMessageApiServer } from '../utils/startMessageApiServer';
import userVisitServiceWorker from '../userVisit/UserVisitServiceWorker'

userVisitServiceWorker.init();

// init service workder message api server for content.js
startMessageApiServer(serviceWorkerApi);






