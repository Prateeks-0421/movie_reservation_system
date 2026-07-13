const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addmovie(req, res) {
    try {

        const {
            title,
            description,
            genre,
            duration,
            language,
            releasedate ,
            posterurl 
        } = req.body;

        // Validation  
        
        if (
            !title ||
            !description ||
            !genre ||
            !duration ||
            !language ||
            !releasedate
        ) {
            return res.render("addmovie", {
                error: "Please fill all the required fields."
            });
        }

        // Check Poster
        if (!req.file) {
            return res.render("addmovie", {
                error: "Please upload a movie poster."
            });
        }

        // Create Movie
        await prisma.movie.create({
            data: {
                title,
                description,
                genre,
                duration: Number(duration),
                language,
                releasedate: new Date(releasedate),
                posterurl: req.file.path
            }
        });


        return res.redirect("/movies");

    } catch (err) {

        console.log(err);

        return res.render("addmovie", {
            error: "Something went wrong."
        });

    }
}

async function getmovie(req, res) {

    try {

        const movies = await prisma.movie.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });


        return res.render("movies", {
            movies
        });

    } catch (err) {

        console.log(err);

            return res.render("home", {
              error : "something went wrong"
          });

    }

}

async function viewmovie(req, res) {

    try {

        const id = Number(req.params.id);

        const movie = await prisma.movie.findUnique({
            where: {
                id: id
            }
        });

        const showtime = await prisma.showTime.findMany({
            where : {
                movieid : id 
            }
        }) ; 

        if (!movie) {
            return res.status(404).send("Movie not found") ;
        }

        return res.render("viewmovie", {
            movie , showtime
        });

    } catch (err) {

        console.log(err);

        return res.render("500");

    }

}

async function deletemovie(req , res ){

  try {
     await prisma.reservation.deleteMany({

    where: {
        showtime: {
            movieid: Number(req.params.id)
        }
    }

 }) ; 

 await prisma.showTime.deleteMany({

    where : {
        movieid : Number(req.params.id) , 
    }

 }) ; 
 
  await prisma.movie.delete({

    where : {
        id : Number(req.params.id) , 
    }

 }) ; 
  }
  catch(error){

    console.log(error) ; 
    res.render("500");

  }
  res.redirect("/movies") ; 
}

module.exports = {
    addmovie , getmovie , viewmovie , deletemovie
};