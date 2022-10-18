import prisma from '../../lib/prisma';
import { nanoid } from 'nanoid';

export default async function assetHandler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const ToDos = await prisma.ToDo.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        res.status(200).json(ToDos);
      } catch (e) {
        console.error('Request error', e);
        res.status(500).json({ error: 'Error fetching ToDos' });
      }
      break;
    case 'POST':
      try {
        const data = JSON.parse(req.body);
        const id = nanoid(12);
        const createdData = await prisma.ToDo.create({ data: { id, ...data } });
        res.status(200).json(createdData);
      } catch (e) {
        console.error('Request error', e);
        res.status(500).json({ error: 'Error creating ToDos' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
