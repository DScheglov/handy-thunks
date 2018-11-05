import { withHandler } from './helpers/async-thunk';

const cleanUp = withHandler('finally');

export default cleanUp;
