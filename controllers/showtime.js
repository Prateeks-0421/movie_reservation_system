const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addshowtime(req , res ){

  try{

      const movieid = Number(req.params.movieid) ; 
   
   const movie = await prisma.movie.findUnique( {
    where : {
        id : movieid , 
    }
   }) ;

   if(!movie){

    res.send("movie not found ") ; 

   }
   
  res.render('addshow' , {movie : movie }) ; 
  }
  catch(error){
    console.log(error) ; 
    res.status(500).send("internal server error") ; 
  }

}

async function postshowtime(req , res ){

    try {

        const movieid = Number(req.params.movieid);

        const {
            showdate,
            showtime,
            screen,
            price,
            totalSeats
        } = req.body;

        // Validation
        if (
            !showdate ||
            !showtime ||
            !screen ||
            !price ||
            !totalSeats
        ) {
            return res.render("addshow", {
                error: "All fields are required.",
                movie: { id: movieid }
            });
        }

        // Check if movie exists
        const movie = await prisma.movie.findUnique({
            where: {
                id: movieid
            }
        });

        if (!movie) {
            return res.status(404).send("Movie not found.");
        }

        // Combine date and time into one Date object
        const datetime = new Date(`${showdate}T${showtime}`);

        // Create show
        await prisma.showTime.create({
            data: {
                movieid,
                showdate: new Date(showdate),
                showtime: datetime,
                screen: Number(screen),
                price: Number(price),
                totalSeats: Number(totalSeats)
            }
        });

        return res.redirect(`/movies/${movieid}`);

    } catch (err) {

        console.log(err);

        return res.status(500).send("Internal Server Error");

    }

}

module.exports = {addshowtime , postshowtime } ; 