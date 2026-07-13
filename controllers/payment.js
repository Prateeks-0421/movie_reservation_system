const prisma = require("../config/prisma");
const razorpay = require("../config/razorpay");
const { client } = require("../client");
const crypto = require("crypto");

async function createorder(req, res) {

    try {

        const showtimeid = Number(req.params.id);
        const { seats } = req.body;

        if (!seats) {

            return res.status(400).json({
                success: false,
                message: "Please select at least one seat."
            });

        }

        const seatArray = seats.split(",");

        // Fetch Show
        const show = await prisma.showTime.findFirst({

            where: {

                id: showtimeid,

                showtime: {

                    gte: new Date()

                }

            },

            include: {

                movie: true

            }

        });

        if (!show) {

            return res.status(404).json({

                success: false,

                message: "Show not found."

            });

        }

        // Lock every seat in Redis
        const lockedSeats = [];

        for (const seat of seatArray) {

            const key = `lock:${showtimeid}:${seat}`;

            const success = await client.set(

                key,
                req.user.id,
 
                {
                    NX: true,
                    EX: 360      // Lock for 6 minutes
                }

            );

            if (!success) {

                // Release previously locked seats

                for (const lockedSeat of lockedSeats) {

                    await client.del(`lock:${showtimeid}:${lockedSeat}`);

                }

                return res.status(400).json({

                    success: false,

                    message: `${seat} is already locked by another user.`

                });

            }

            lockedSeats.push(seat);

        }

        // Calculate amount
        const totalAmount = seatArray.length * show.price;

        // Create Razorpay Order
        const order = await razorpay.orders.create({

            amount: totalAmount * 100,

            currency: "INR",

            receipt: `receipt_${Date.now()}`

        });

        return res.json({

            success: true,

            order,

            amount: totalAmount

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

}


async function verifypayment(req, res) {

    try {

        const {

            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            showtimeid,
            seats

        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZOR_PAY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({

                success: false,
                message: "Payment verification failed."

            });

        }

        const show = await prisma.showTime.findUnique({

            where: {

                id: Number(showtimeid)

            }

        });

        if (!show) {

            return res.status(404).json({

                success: false,
                message: "Show not found."

            });

        }

        const seatArray = seats.split(",");

        const totalAmount = seatArray.length * show.price;

        await prisma.$transaction(async (tx) => {

         await tx.reservation.create({

                data: {

                    userid: req.user.id,

                    showtimeid: Number(showtimeid),

                    seats: seats,

                    totalamount: totalAmount,

                    status: "CONFIRMED"

                }

            });

        });

        // Release Redis Locks

        for (const seat of seatArray) {

            await client.del(`lock:${showtimeid}:${seat}`);

        }

             const reservation = await prisma.reservation.findFirst({

                where: {

                    userid: req.user.id,

                    showtimeid: Number(showtimeid),

                    seats: seats,

                    totalamount: totalAmount,

                    status: "CONFIRMED"

                }

            });


        return res.json({

            success: true , 
            id : reservation.id , 

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

}

async function paymentsuccess(req, res) {

    const reservation = await prisma.reservation.findUnique({

        where: {
            id: Number(req.params.id)
        },

        include: {

            user: true,

            showtime: {

                include: {

                    movie: true

                }

            }

        }

    });

    if (!reservation) {

        return res.send("Reservation not found.");

    }

    res.render("paymentsuccess", {

        reservation

    });

}

function paymentfailed(req, res) {

    res.render("paymentfailed");

}



module.exports = {createorder , verifypayment , paymentsuccess , paymentfailed } ; 