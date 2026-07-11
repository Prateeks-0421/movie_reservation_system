const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function admindashboard(req, res) {

    try {

        const totalMovies = await prisma.movie.count();

        const totalUsers = await prisma.user.count();

        const totalShows = await prisma.showTime.count();

        const totalReservations = await prisma.reservation.count();

        const revenue = await prisma.reservation.aggregate({

            _sum: {
                totalamount: true
            }

        });

        res.render("dashboard", {

            totalMovies,

            totalUsers,

            totalShows,

            totalReservations,

            revenue: revenue._sum.totalamount || 0

        });

    }

    catch (err) {

        console.log(err);

        res.send("Internal Server Error");

    }

}

module.exports = { admindashboard } ; 
