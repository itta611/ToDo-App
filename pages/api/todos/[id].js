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
    case 'PATCH':
      try {
        const data = JSON.parse(req.body);
        const updatedToDo = await prisma.ToDo.update({
          where: { id },
          data,
        });
        res.status(200).json(updatedToDo);
      } catch (e) {
        console.error('Request error', e);
        res.status(500).json({ error: 'Error updating ToDo' });
      }
    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
