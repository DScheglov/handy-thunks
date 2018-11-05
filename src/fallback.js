import { withHandler } from './helpers/async-thunk';

const fallback = withHandler('catch');

export default fallback;
