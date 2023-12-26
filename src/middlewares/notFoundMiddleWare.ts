import { Response } from 'express';

const notFound = (_: any, res: Response) => res.status(400).send('Route does not exist');

export default notFound;