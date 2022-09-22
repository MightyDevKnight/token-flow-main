// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import Cors from 'cors';
import { tokenData } from '../../utils/tokenData';
import { PrismaClient } from '@prisma/client';
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

type Data = {
  result: Object,
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
  await runMiddleware(req, res, cors);
  
  const fileName = req.query.id as string;
  if(fileName === 'undefined')
    return res.status(405).end();
  try {
    
    const themeData = await prisma.token.findFirst({
      where: {
        userId: fileName,
      }
    }
    );
    const token = await tokenData.read(fileName);
    if(themeData !== null)
      return res.status(200).json({ result: {token, themeData}});
  } catch (error) {
    res.json(error);
    res.status(405).end();
  }
  // if(req.query.id !== 'undefined'){
  //   const themeData = await prisma.token.findFirst({
  //     where: {
  //       userId: fileName,
  //     }
  //   }
  //   );
  //   const token = await tokenData.read(fileName);
  //   return res.status(200).json({ result: {token, themeData}});  
  // }
}
