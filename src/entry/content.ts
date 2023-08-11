import { contentApi } from '../messageApi/contentApi';
import { startMessageApiServer } from '../utils/startMessageApiServer';
import userVisitContent from '../userVisit/UserVisitContent';
import { contentApiRequest } from '../messageApi/contentApiRequest';


userVisitContent.init();

// start content.js message api server for background.js (service worker)
startMessageApiServer(contentApi);
