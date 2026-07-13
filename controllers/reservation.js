const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const PDFDocument = require("pdfkit") ; 

async function bookingpage(req, res) {

    const show = await prisma.showTime.findUnique({
        where: {
            id: Number(req.params.showid) , 

             showtime: {
                      gte: new Date()
                         }
        },
        include: {
            movie: true
        }
    });

    if (!show) {
        return res.status(404).send("Show not found");
    }

    const reservations = await prisma.reservation.findMany({

             where:{
          showtimeid:Number(req.params.showid)
        }

       });

     const bookedSeats = [] ; 

           reservations.forEach((reservation)=>{

         bookedSeats.push(

        ...reservation.seats.split(",")  ) 
    
    } ) ; 

      console.log(bookedSeats) ; 

    res.render("booking", { show  , bookedSeats , key_id : process.env.RAZOR_PAY_KEY });
}


async function bookingtickets(req, res) {

    try {

        const showtimeid = Number(req.params.showid);
        const { seats } = req.body;


        const seatArray = seats.split(",");

        await prisma.$transaction(async (tx) => {

            // Fetch show details
            const show = await tx.showTime.findUnique({
                where: {
                    id: showtimeid , 

                         showtime: {
                      gte: new Date()
                         }
                } , 
                include: {
            movie: true
        }
            });

            if (!show) {
                throw new Error("Show not found.");
            }

            // Fetch all reservations for this show
            const reservations = await tx.reservation.findMany({
                where: {
                    showtimeid: showtimeid
                }
            });

            // Extract all booked seats
            const bookedSeats = [];

            reservations.forEach((reservation) => {

                bookedSeats.push(
                    ...reservation.seats.split(",")
                );

            });

            // Check if any selected seat is already booked
            const alreadyBooked = seatArray.some((seat) => {

                return bookedSeats.includes(seat);

            });

            if (alreadyBooked) {
                throw new Error("Some seats are already booked.");
            }

                   if (!seats) {
            return  res.render("booking", { show  , bookedSeats , error : "please select atleast one seat " });
        }

            // Calculate total price
            const totalAmount = seatArray.length * show.price;

            // Create reservation
            await tx.reservation.create({

                data: {

                    userid: req.user.id,
                    showtimeid: showtimeid,
                    seats: seats,
                    totalamount: totalAmount

                }

            });

        });

        return res.redirect("/reservations");

    }
    catch (err) {

        console.log(err);

        return res.status(500).send(err.message);

    }

}

async function myreservations(req, res) {

    try {

        const reservations = await prisma.reservation.findMany({

            where: {
                userid: req.user.id
            },

            include: {

                showtime: {

                    include: {

                        movie: true

                    }

                }

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        return res.render("myreservations", {

            reservations

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).send("Internal Server Error");

    }


}

async function downloadpdf( req , res ){

try {

        const reservation = await prisma.reservation.findUnique({

            where: {

                id: Number(req.params.id)

            },

            include: {

                showtime: {

                    include: {

                        movie: true

                    }

                },

                user: true

            }

        });

        if (!reservation) {

            return res.send("Reservation not found.");

        }

        const doc = new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=MovieTicket-${reservation.id}.pdf`
        );

        doc.pipe(res);

        doc.fontSize(26)
           .fillColor("red")
           .text(" MovieHub", {
                align: "center"
           });

        doc.moveDown();

        doc.fontSize(20)
           .fillColor("black")
           .text("Movie Ticket", {
                align: "center"
           });

        doc.moveDown();

        doc.fontSize(14);

        doc.text(`Booking ID : ${reservation.id}`);

        doc.text(`Customer : ${reservation.user.name}`);

        doc.text(`Movie : ${reservation.showtime.movie.title}`);

        doc.text(`Seats : ${reservation.seats}`);

        doc.text(`Amount Paid : ${reservation.totalamount}`);

        doc.text(`Status : ${reservation.status}`);

        doc.text(
            `Date : ${
                reservation.showtime.showdate.toLocaleDateString()
            }`
        );

        doc.text(
            `Time : ${
                reservation.showtime.showtime.toLocaleTimeString()
            }`
        );

        doc.text(`Screen : ${reservation.showtime.screen}`);

        doc.moveDown();

        doc.text(
            "Please arrive 20 minutes before the show."
        );

        doc.end();

    }

    catch(err){

        console.log(err);

        res.send("Something went wrong.");

    }


}

module.exports = {bookingpage , bookingtickets , myreservations , downloadpdf } ;