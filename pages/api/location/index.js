
import { PrismaClient } from '@prisma/client'


export default function handler(req, res) {
    
    const method = req.method;


    switch (method) {
        case "GET" : get(req, res); break;
        case "POST" : post(req, res); break;
        default : defaultCall(req, res); break;
    }

}

async function get(req, res) {
        // create a new prisma client.
        // make sure to disconnect after usage! :)
        const prisma = new PrismaClient()

        await prisma.$connect();

        const allLocations = await prisma.location.findMany({
            include: {
                stock: true,
            },
            orderBy: {
                code: "asc",
              },
        });

        // disconnect clien after usage.
        await prisma.$disconnect();

        if ((await allLocations).length <= 0) {
            res.status(500).json({error: "Could not get any locations from the database!"})
        }
        
        res.status(200).json({results: allLocations});

}
async function post(req, res) {
        // create a new prisma client.
        // make sure to disconnect after usage! :)
        const prisma = new PrismaClient()

        const body = JSON.parse(req.body);
        const {code, name} = body;


        
        if (isNaN(code)) {
            res.status(400).json({error: "The location code was not a solid number."})
            return;
        }
        
        await prisma.$connect();
        await prisma.Location.create({
            data: {
                code: parseInt(code),
                name: name,
                stock: {
                    createMany: {
                        data: [
                          { note: 'Great post!' },
                          { note: "Can't wait to read more!" },
                        ],
                      },
                    },
            }
        });

        // disconnect clien after usage.
        await prisma.$disconnect();

        // -- RETURN RESULTS --
        
        get(req, res);
}
async function defaultCall(req, res) {

}