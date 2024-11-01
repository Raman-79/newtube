import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const users = await prisma.user.findMany()
    res.json(users)
  } else if (req.method === 'POST') {
    const { name, email } = req.body
    const user = await prisma.user.create({
      data: { name, email },
    })
    res.status(201).json(user)
  }
}
