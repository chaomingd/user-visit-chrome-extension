import { createContentMessageApiRequest } from '../utils/createMessageApiRequest';
import { serviceWorkerApi } from './serviceWorkerApi'

export const contentApiRequest = createContentMessageApiRequest<typeof serviceWorkerApi>();
