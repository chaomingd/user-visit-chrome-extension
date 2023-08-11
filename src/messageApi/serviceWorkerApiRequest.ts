import { createServiceWorkerMessageApiRequest } from '../utils/createMessageApiRequest';
import { contentApi } from './contentApi';

export const serviceWorkerApiRequest = createServiceWorkerMessageApiRequest<typeof contentApi>();
