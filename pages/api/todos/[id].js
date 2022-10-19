import prisma from '../../../lib/prisma';

export default async function assetHandler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'DELETE':
      try {
        const deletedToDo = await prisma.ToDo.delete({ where: { id } });
        res.status(200).json(deletedToDo);
      } catch (e) {
        console.error('Request error', e);
        res.status(500).json({ error: 'Error deleting ToDo' });
      }
      break;
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
