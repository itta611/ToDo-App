import prisma from '../../../lib/prisma';

export default async function assetHandler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'DELETE':
      try {
        await prisma.ToDo.delete({ where: { id } });
        const updatedTodos = await prisma.ToDo.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        res.status(200).json(updatedTodos);
      } catch (e) {
        console.error('Request error', e);
        res.status(500).json({ error: 'Error deleting ToDo' });
      }
      break;
    case 'PATCH':
      try {
        const data = JSON.parse(req.body);
        await prisma.ToDo.update({
          where: { id },
          data,
        });

        const updatedTodos = await prisma.ToDo.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        });
        res.status(200).json(updatedTodos);
        break;
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
