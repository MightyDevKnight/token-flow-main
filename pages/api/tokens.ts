// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors';
import { tokenData } from '../../utils/tokenData';
import { PrismaClient } from '@prisma/client';

type Data = {
  result: string
}

const prisma = new PrismaClient();

const cors = Cors({
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  origin: '*',
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors)  

  const userId = await tokenData.create(req.body.tokenData);
  let stringAvailableThemes: string = '', stringThemeObjects: string = '';
  req.body.availableThemes.map(theme => stringAvailableThemes += JSON.stringify(theme) + '---');
  req.body.themeObjects.map(themeObject => stringThemeObjects += JSON.stringify(themeObject) + '---');
  
  await prisma.token.create({
    data:{
      userId: userId,
      activeTheme: req.body.activeTheme !== null ? req.body.activeTheme : '',
      availableThemes: stringAvailableThemes.slice(0, -3),
      usedTokenSet: JSON.stringify(req.body.usedTokenSet),
      themeObjects: stringThemeObjects.slice(0, -3),
    }
  });
  
  return res.status(200).json({result: userId});  
}
