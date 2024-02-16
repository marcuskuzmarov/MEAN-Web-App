// external libraries
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nm = require('nodemailer');
const path = require('path');
const transporter = require('./tokenSender');
// app uses express library
const app = express();

// mongodb url
const dbURI = 'mongodb+srv://mkuzmaro:mkuzmaro1357@lab3.3xn6uiv.mongodb.net/superheroes?retryWrites=true&w=majority' // removed URI for privacy
// collections in mongodb
const Infos = require('./models/infos');
const Powers = require('./models/powers');
const Lists = require('./models/lists');
const Users = require('./models/users');
const Reviews = require('./models/reviews');
const Privacy = require('./models/privacy');
const DMCA = require('./models/dmca');
const AccUse = require('./models/acc-use');
const DMCANotices = require('./models/dmcanotices');
// creating a router for shorthand urls
const routerHero = express.Router();
const routerUser = express.Router();
const routerPolicy = express.Router();
// port number for server
const port = 3000;

// cors requirements
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
app.use(cookieParser());

app.use(express.json());

// displays the specific request made
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// displays the static index.html when a GET request for / is made
//app.use('/', express.static(path.join(__dirname, '..', 'client')));

/// returns a list of all hero publishers
routerHero.route('/publishers')
    .get((req, res) => {
        Infos.find({}, 'publisher').select('-_id')
            .then((publishersDB => {
                const publishers = [];
                for (const p of publishersDB) {
                    if (!publishers.includes(p.publisher) && p.publisher !== '') publishers.push(p.publisher);
                }
                res.send(publishers);
            }))
            .catch(err => console.log(err));
    });

// functionality for getting all stored lists and creating a new list
// routerHero.route('/lists/:owner')
// .get((req, res) => Lists.find({owner: req.params.owner}).then(lists => lists.map(list => list.lName)).then(lists => {
//     res.send(lists)
// }))
// .post((req, res) => {
//     // input validation for user input reinjected into front end
//     if (!req.body.lName || req.body.lName.length > 20 || containsHTML(req.body.lName)) return res.status(400).send('invalid...');
//     Lists.find({ lName: req.body.lName })
//         .then(list => {
//             if (list[0]) return res.status(409).send(list[0]);
//             else {
//                 new Lists({
//                     owner: req.body.owner,
//                     lName: req.body.lName,
//                     ids: req.body.ids
//                 }).save()
//                     .then((result) => res.send(result))
//                     .catch(err => console.log(err));
//             }
//         })
//         .catch(err => console.log(err));
// });


routerHero.route('/lists')
    // gets all lists for a user
    .get((req, res) => {
        try {
            const cookie = req.cookies['jwt'];
            const claims = jwt.verify(cookie, 'secret');
            if (!claims) return res.status(401).send({ status: 401, message: 'unauthenticated...' });
            Lists.find({ owner: req.query.owner })
                .then(lists => lists.map(list => list.lName))
                .then(lists => {
                    res.send(lists)
                })

        } catch (err) {
            res.status(401).send({ status: 401, message: 'unauthenticated...' });
        }
    })
    // adds a new list for a user
    .post(async (req, res) => {
        // input validation for user input reinjected into front end
        if (!req.body.lName || req.body.lName.length > 20 || containsHTML(req.body.lName) || containsHTML(req.body.lDesc)) return res.status(400).send({ status: 400, message: 'Enter a list name...' });
        const userLists = await Lists.find({ owner: req.body.owner })
        if (userLists.length >= 20) return res.status(403).send({ status: 403, message: 'Too many lists...' });
        Lists.find({ lName: req.body.lName, owner: req.body.owner })
            .then(list => {
                if (list[0]) return res.status(409).send({ status: 409, message: 'List name taken...' });
                else {
                    new Lists({
                        owner: req.body.owner,
                        lName: capitalize(req.body.lName),
                        ids: req.body.ids,
                        lDesc: req.body.lDesc
                    }).save()
                        .then((result) => res.send(result))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    });

routerHero.route('/lists/public')
    // gets all public lists
    .get(async (req, res) => {
        const publicLists = await Lists.find({ public: true }).sort({ updatedAt: -1 }).limit(10).select('-_id -createdAt -updatedAt -__v -public');
        res.send(publicLists);
    })

// functionality for getting list info, updating list info, and deleting a list
routerHero.route('/lists/:lName')
    // gets a specific list for a user
    .get(async (req, res) => {
        const list = await Lists.findOne({ lName: req.params.lName, owner: req.query.owner });
        if (!list) return res.status(404).send('no matches...');
        if (list.public === true) return res.send(list);
        else {
            try {
                const cookie = req.cookies['jwt'];
                const claims = jwt.verify(cookie, 'secret');
                if (!claims) return res.status(401).send({ status: 401, message: 'unauthenticated...' });
                res.send(list);
            } catch (err) {
                res.status(401).send({ status: 401, message: 'unauthenticated...' });
            }
        }
    })
    // updates visibility of a specific user's list
    .put(async (req, res) => {
        try {
            const cookie = req.cookies['jwt'];
            const claims = jwt.verify(cookie, 'secret');
            if (!claims) return res.status(401).send({ status: 401, message: 'unauthenticated...' });
            if (!req.params.lName) return res.status(400).send('blank...');
            if (req.body.type == 'visibility') {
                const list = await Lists.findOne({ lName: req.body.lName, owner: req.query.owner });
                list.public = list.public === true ? false : true;
                await list.save();
                res.send({ status: 200, message: 'success...' });
            } else {
                Lists.findOne({ lName: req.body.lName, owner: req.query.owner }).updateOne({ ids: req.body.ids, lDesc: req.body.lDesc })
                    .then((result) => {
                        if (result.modifiedCount === 0) return res.status(404).send('no matches...');
                        res.send(result);
                    })
                    .catch(err => console.log(err));
            }
        } catch (err) {
            res.status(401).send({ status: 401, message: 'unauthenticated...' });
        }
    })
    // deletes a specific user's list
    .delete(async (req, res) => {
        try {
            const cookie = req.cookies['jwt'];
            const claims = jwt.verify(cookie, 'secret');
            if (!claims) return res.status(401).send({ status: 401, message: 'unauthenticated...' });
            if (!req.body.lName) return res.status(400).send('blank...');
            const reviews = await Reviews.find({ lName: req.body.lName, owner: req.query.owner }).deleteMany();
            Lists.find({ lName: req.body.lName, owner: req.query.owner }).deleteOne()
                .then((result) => {
                    if (result.deletedCount === 0) return res.status(404).send('no matches');
                    res.send(result);
                })
                .catch(err => console.log(err));
        } catch {
            res.status(401).send({ status: 401, message: 'unauthenticated...' });
        }

    });

routerHero.route('/reviews')
    // gets all reviews in system
    .get(async (req, res) => {
        const result = await Reviews.find({}).select('-_id -createdAt -updatedAt -__v');
        res.send(result);
    })
    // adds a review to a list
    .post(async (req, res) => {
        if (!req.body.lName || !req.body.owner || !req.body.username || req.body.rating < 0 || req.body.rating > 5) return res.status(400).send({ status: 400, message: 'Please enter a rating...' });
        const listReview = await Reviews.findOne({ lName: req.body.lName, owner: req.body.owner, username: req.body.username });
        if (listReview) return res.status(409).send({ status: 409, message: 'You have already reviewed this list...' });
        if (req.body.comment === '') req.body.comment = 'None';

        const review = await new Reviews({
            lName: req.body.lName,
            owner: req.body.owner,
            username: req.body.username,
            rating: req.body.rating,
            comment: req.body.comment
        }).save();

        const list = await Lists.findOne({ lName: req.body.lName, owner: req.body.owner });
        if (list.avgRating === 'N/A') list.avgRating = 0;

        const ratings = await Reviews.find({ lName: req.body.lName, owner: req.body.owner }).select('rating');
        avg = 0;
        for (const rating of ratings) {
            avg += rating.rating;
        }

        const avgRating = avg / ratings.length;

        await list.updateOne({ avgRating: avgRating, totalRatings: list.totalRatings + 1 });
        // const listRating = await Lists.findOne({ lName: req.body.lName, owner: req.body.owner }).updateOne({ rating: req.body.rating })

        res.send({ status: 200, message: 'result' });
    })
    // updates visibility of a review
    .put(async (req, res) => {
        try {
            const cookie = req.cookies['jwt'];
            const claims = jwt.verify(cookie, 'secret');
            if (!claims) return res.status(401).send({ status: 401, message: 'unauthenticated...' });
            const toggleReview = await Reviews.findOne({ lName: req.body.review.lName, owner: req.body.review.owner, username: req.body.review.username });
            if (req.body.toggle === 'visible') toggleReview.visible = toggleReview.visible === true ? false : true;
            await toggleReview.save();
            res.send({ status: 200, message: 'success...' });
        } catch (err) {
            res.status(401).send({ status: 401, message: 'unauthenticated...' });
        }
    });

routerHero.route('/reviews/:lName')
    // gets all reviews for a list
    .get(async (req, res) => {
        const listReviews = await Reviews.find({ lName: req.params.lName, owner: req.query.owner, visible: true }).select('-_id -createdAt -updatedAt -__v');
        res.send(listReviews);
    });

// takes the users search input and returns matches
routerHero.route('/search')
    .get((req, res) => {
        let { name, race, publisher, power, limit } = req.query;
        if (!name && !race && !publisher && !power) return res.status(400).json({ status: 400, message: 'empty...' });
        if (name.length > 20 || race.length > 20 || publisher.length > 20 || power > 20 || limit > 1000) return res.status(400).json('bad...');
        if (limit) limit = 50;

        const query = {};

        if (name) query.name = new RegExp(`^${removeWhitespace(name).split('').join('.{0,2}')}`, 'i');
        if (race) query.race = new RegExp(`^${removeWhitespace(race).split('').join('.{0,2}')}`, 'i');
        if (publisher) query.publisher = new RegExp(`^${removeWhitespace(publisher).split('').join('.{0,2}')}`, 'i');

        Infos.find(query)
            .select('-_id -createdAt -updatedAt -__v')
            .then(matchingHeroes => {
                if (power) {
                    const powerQuery = {};
                    powerQuery[capitalize(power)] = "True";
                    Powers.find(query).select('-_id -createdAt -updatedAt -__v')
                        .then(matchingPowers => {
                            const matchingHeroNames = matchingPowers.map(hero => hero.hero_names);
                            matchingHeroes = matchingHeroes.filter(hero => matchingHeroNames.includes(hero.name));
                            if (matchingHeroes.length === 0) return res.status(404).json('no matches...');
                            if (limit > 0 && limit < matchingHeroes.length) matchingHeroes = matchingHeroes.slice(0, limit);
                            res.send(matchingHeroes);
                        })
                        .catch(err => console.log(err));
                } else {
                    if (matchingHeroes.length === 0) return res.status(404).json('no matches...');
                    if (limit > 0 && limit < matchingHeroes.length) matchingHeroes = matchingHeroes.slice(0, limit);
                    res.send(matchingHeroes);
                }
            })
            .catch(err => console.log(err));
    });

// gets the powers for a superhero from its name
routerHero.route('/powers/:name')
    .get((req, res) => {
        Powers.find({ hero_names: `${req.params.name}` }).select('-_id -createdAt -updatedAt -__v')
            .then((result) => {
                heroPowers = [];
                if (!result[0]) return res.status(404).send('no powers...');
                for (const power in result[0]) {
                    if (result[0][power] === 'True') heroPowers.push(power);
                }
                res.send(heroPowers);
            })
            .catch(err => console.log(err));
    });

// gets the info for a hero from their id
routerHero.route('/:id').get(async (req, res) => {
    try {
        const hero = await Infos.findOne({ id: `${req.params.id}` }).select('-_id -createdAt -updatedAt -__v')
        if (!hero) return res.status(404).send('no matches...');
        const powersResult = await Powers.findOne({ hero_names: `${hero.name}` }).select('-_id -createdAt -updatedAt -__v')
        const heroPowers = [];

        if (!powersResult) heroPowers.push(`${hero.name} Has No Powers...`);
        else {
            for (const power in powersResult.toObject()) {
                if (powersResult[power] === 'True') heroPowers.push(power);
            }
        }
        const heroObject = hero.toObject();
        heroObject.powers = heroPowers;
        res.send(heroObject);
    } catch (err) {
        res.status(500).send('server error...');
    }
});

// gets all hero info limited to 50 heroes
routerHero.route('/')
    .get(async (req, res) => {
        const heroes = await Infos.find({}).limit(50).select('-_id -createdAt -updatedAt -__v')
        if (!heroes) return res.status(404).send('no heroes in the system...');
        res.send(heroes);
    });

routerUser.route('/')
    // gets all user info in the system
    .get((req, res) => {
        Users.find({}).select('-_id -createdAt -updatedAt -__v -password')
            .then((users) => {
                if (!users[0]) return res.status(404).send('no matches...');
                res.send(users);
            })
            .catch(err => console.log(err));
    })
    // creates a new user with email confirmation
    .post(async (req, res) => {
        if (!req.body.username || !req.body.email || !req.body.password) return res.status(400).send('blank...');

        let duplicateUser = await Users.findOne({ username: req.body.username });
        if (duplicateUser) return res.status(409).send({ type: 'username', message: 'Username unavailable...' });
        let duplicateEmail = await Users.findOne({ email: req.body.email });
        if (duplicateEmail) return res.status(409).send({ type: 'email', message: 'Email unavailable...' });

        const salt = await bcrypt.genSalt(10);

        const hashedPasssword = await bcrypt.hash(req.body.password, salt);

        const user = new Users({
            username: capitalize(req.body.username),
            email: req.body.email,
            password: hashedPasssword
        });

        const result = await user.save();

        const { _id } = await result.toJSON();

        const token = jwt.sign({
            data: _id
        }, 'secret', { expiresIn: '10m' });

        const mailConfigurations = {

            // It should be a string of sender/server email 
            from: 'kuzmobeatz@gmail.com',

            to: req.body.email,

            // Subject of Email 
            subject: 'Email Verification',

            // This would be the text of email body 
            text: `Hi! There, You have recently visited  
                   our website and entered your email. 
                   Please follow the given link to verify your email 
                   http://localhost:3000/verify/${token}
                   Thanks`

        };

        transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) throw Error(error);
            console.log('Email Sent Successfully');
        });

        res.send({ status: 200, message: 'success...' });
    });

// verifies email confirmation from jwt
app.get('/verify/:token', async (req, res) => {
    const { token } = req.params;

    jwt.verify(token, 'secret', async (err, decodedToken) => {
        if (err) {
            console.log(err.message);
            return res.status(400).send('Email verification failed, link is invalid or expired...');
        }
        const user = await Users.findOne({ _id: decodedToken.data });
        if (!user) return res.status(400).send('Email verification failed, link is invalid or expired...');
        if (user.confirmed) return res.status(400).send('Email already verified...');
        const result = await user.updateOne({ confirmed: true });
        res.send("Email verified successfully! Please return to the app to login...");
    });
});

// resends email confirmation
routerUser.route('/resend')
    .post(async (req, res) => {

        const user = await Users.findOne({ email: req.body.email });
        console.log(user)

        const token = jwt.sign({
            data: user._id
        }, 'secret', { expiresIn: '10m' });

        const mailConfigurations = {

            // It should be a string of sender/server email 
            from: 'kuzmobeatz@gmail.com',

            to: req.body.email,

            // Subject of Email 
            subject: 'Email Verification',

            // This would be the text of email body 
            text: `Hi! There, You have recently visited  
                   our website and entered your email. 
                   Please follow the given link to verify your email 
                   http://localhost:3000/verify/${token}
                   Thanks`

        };

        transporter.sendMail(mailConfigurations, function (error, info) {
            if (error) throw Error(error);
            console.log('Email Sent Successfully');
            // console.log(info);
        });

        res.send({ status: 200, message: 'success...' });
    });

routerUser.route('/user')
    // checks if user is logged in
    .get(async (req, res) => {
        try {
            const cookie = req.cookies['jwt'];
            const claims = jwt.verify(cookie, 'secret');
            if (!claims) return res.status(401).send({ status: 401, message: 'unauthenticated...' });
            const user = await Users.findOne({ _id: claims._id })
            const { password, ...data } = await user.toJSON();
            res.send(data);
        } catch (err) {
            res.status(401).send({ status: 401, message: 'unauthenticated...' });
        }
    })
    // updates characteristics of a user
    .put(async (req, res) => {
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, 'secret');
        if (!claims) return res.status(401).send({ status: 401, message: 'unauthenticated...' });
        const currentUser = await Users.findOne({ _id: claims._id })
        if (currentUser.userType !== 'admin') return res.status(403).send({ status: 403, message: 'unauthorized...' });
        const toggleAdmin = await Users.findOne({ email: req.body.user.email })
        if (!toggleAdmin) return res.status(404).send({ status: 404, message: 'user not found...' });
        if (req.body.toggle === 'admin') toggleAdmin.userType = toggleAdmin.userType === 'admin' ? 'user' : 'admin';
        else if (req.body.toggle === 'active') toggleAdmin.active = toggleAdmin.active === true ? false : true;
        await toggleAdmin.save();
        res.send({ status: 200, message: 'success...' });
    })

// changes user's password
routerUser.route('/password')
    .put(async (req, res) => {
        const cookie = req.cookies['jwt'];
        const claims = jwt.verify(cookie, 'secret');
        if (!claims) return res.status(401).send({ status: 401, message: 'unauthenticated...' });
        const salt = await bcrypt.genSalt(10);
        const hashedPasssword = await bcrypt.hash(req.body.password, salt);
        const user = await Users.findOne({ _id: claims._id }).updateOne({ password: hashedPasssword });
        res.send({ status: 200, message: 'success...' });
    });

// logs in user
routerUser.route('/login')
    .post(async (req, res) => {
        const user = await Users.findOne({ email: req.body.email })
        if (!user) return res.status(404).send({ status: 404, type: 'email', message: 'Email not found...' });
        if (!user.active) return res.status(401).send({ status: 401, type: 'deactive', message: 'Account deactivated!', email: 'mailto:mkuzmaro@uwo.ca' });
        if (!user.confirmed) {
            return res.status(401).send({ status: 401, type: 'unconfirmed', message: 'Email not verified...' });
        }

        if (!await bcrypt.compare(req.body.password, user.password)) return res.status(400).send({ status: 400, message: 'Invalid credentials...' });

        const token = jwt.sign({ _id: user._id }, 'secret');

        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        const { password, ...data } = await user.toJSON();

        res.send({ status: 200, message: 'success...', user: data });
    });

// logs out user
routerUser.route('/logout')
    .post((req, res) => {
        res.cookie('jwt', '', { maxAge: 0 });
        res.send({ status: 200, message: 'success...' });
    });


routerPolicy.route('/privacy')
    // gets privacy policy
    .get(async (req, res) => {
        const policy = await Privacy.findOne({}).select('-_id');
        res.send(policy);
    })
    // updates privacy policy
    .put(async (req, res) => {
        if (!req.body.policy) return res.status(400).send('blank...');
        const policy = await Privacy.findOne({}).updateOne({ policy: req.body.policy });
        res.send({ status: 200, message: 'success...' });
    });


routerPolicy.route('/dmca')
    // gets dmca policy
    .get(async (req, res) => {
        const policy = await DMCA.findOne({}).select('-_id');
        res.send(policy);
    })
    // adds a dmca report
    .post(async (req, res) => {
        const newDCMA = await new DMCANotices({
            lName: req.body.report.lName,
            owner: req.body.report.owner,
            username: req.body.report.username,
            dateReqRcvd: req.body.report.dateReqRcvd,
            dateNotSent: req.body.report.dateNotSent,
            dateDisRvcd: req.body.report.dateDisRvcd,
            notes: req.body.report.notes,
            status: req.body.report.status
        }).save();
    })
    // updates dmca policy
    .put(async (req, res) => {
        if (!req.body.policy) return res.status(400).send('blank...');
        const policy = await DMCA.findOne({}).updateOne({ policy: req.body.policy })

        res.send({ status: 200, message: 'success...' });
    });

routerPolicy.route('/dmca-notices')
    // gets all dmca reports for a review
    .post(async (req, res) => {
        const notices = await DMCANotices.find({ lName: req.body.lName, owner: req.body.owner, username: req.body.username }).select('-_id -createdAt -updatedAt -__v');
        if (!notices[0]) return res.status(404).send({ status: 404, message: 'No Reports!' });
        let notices_ = notices.map(notice => {
            let noticeObject = notice.toObject();
            if (noticeObject.dateReqRcvd) noticeObject.dateReqRcvd = noticeObject.dateReqRcvd.toLocaleDateString();
            if (noticeObject.dateNotSent) noticeObject.dateNotSent = noticeObject.dateNotSent.toLocaleDateString();
            if (noticeObject.dateDisRvcd) noticeObject.dateDisRvcd = noticeObject.dateDisRvcd.toLocaleDateString();
            return noticeObject;
        });
        res.send(notices_);
    });

routerPolicy.route('/acc-use')
    // gets acceptable use policy
    .get(async (req, res) => {
        const policy = await AccUse.findOne({}).select('-_id');
        res.send(policy);
    })
    // updates acceptable use policy
    .put(async (req, res) => {
        if (!req.body.policy) return res.status(400).send('blank...');
        const policy = await AccUse.findOne({}).updateOne({ policy: req.body.policy })
        res.send({ status: 200, message: 'success...' });
    });


// checks if input contais html
function containsHTML(input) {
    return /<[^>]*>/.test(input);
}

// capitalizes specified word or phrase
function capitalize(phrase) {
    return String(phrase).split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// removes whitespace from a string
function removeWhitespace(str) {
    return str.replace(/\s/g, '');
}

// router for designated api url
app.use('/api/superheroes', routerHero);
app.use('/api/users', routerUser);
app.use('/api/policy', routerPolicy);

// connect mongoose to app and listen on designated port
mongoose.connect(dbURI)
    .then(() => app.listen(port, () => console.log(`listening on port ${port}...`)))
    .catch(err => console.log(err));
