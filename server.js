const express			= require('express');
const bodyParser		= require('body-parser');
const expressValidator	= require('express-validator');

const mongo 			= require('mongodb');
const { ObjectID } 		= require('mongodb');
const mongoose 			= require('mongoose');

const { Employee } 		= require('./models/employee');

const dbUrl = 'mongodb://ahmed_soliman:123456@ds113358.mlab.com:13358/employees'
mongoose.connect( dbUrl , (err) => {
	if(err) {
		return console.log('Unable to connect to DB', err)
	}

	console.log('Connected Successfully fo DB.')
});

const db 	= mongoose.connection;
const app 	= express();
const port 	= process.env.PORT || 3000;



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Serving static files
app.use(express.static('uploads'));
//cross Origin
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

// Validator
app.use(expressValidator({
	errorFormatter: ( param, msg, value ) => {
		let namespace 	= param.split('.')
		, root			= namespace.shift()
		, formParam		= root;

		while ( namespace.length ) {
			formParam += `[${namespace.shift()}]`;
		}

		return {
			param  	: formParam,
			msg		: msg,
			value	: value
		};
	}
}));

app.get('/employee', ( req, res ) => {
	Employee.find({})
		.then(
			(employees) => {
				res.status(200).send({ success: true, employees });
			},
			( err ) => {
				res.status(400).send({ success: false, msg: 'Unable to fetch employees'});
			}
		)
		.catch(
			( err ) => {
				res.status(500).send({ success: false, msg: 'An Error has occured.' });
			})
});

app.get('/employee/:id', ( req, res ) => {
	let _id = req.params.id;

	Employee.find({ _id })
		.then(
			(employee) => {
				if ( !employee.length ) {
					return res.status(404).send({ success: false, msg: 'Unable to fetch employee with the provided ID'});
				}

				res.status(200).send({ success: true, employee });

			},
			( err ) => {
				res.status(400).send({ success: false, msg: 'Unable to fetch employee'});
			}
		)
		.catch(
			( err ) => {
				res.status(500).send({ success: false, msg: 'An Error has occured.' });
			}
		)
});

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
app.post('/employee/add', upload.single('profileImage'), ( req, res, next ) => {

	let name 			= req.body.name.trim();
	let position 		= req.body.position.trim();
	let about			= req.body.about.trim();
	let linkedInAcc		= req.body.linkedInAcc.trim();
	let profileImage 	= req.file ? req.file.filename : 'noImage.jpg';

	// validation
	req.checkBody('name', 'name field is required.').trim().notEmpty();
	req.checkBody('position', 'position field is required').trim().notEmpty();
	req.checkBody('about', 'about field is required').trim().notEmpty();
	req.checkBody('linkedInAcc', 'linkedIn Account field is required').trim().notEmpty();

	let errors = req.validationErrors();

	if ( errors ) {
		return res.status(400).send({ errors });
	}

	const newEmployee = new Employee({ name, position, about, linkedInAcc, profileImage });

	newEmployee.save().then((employee) => {
		res.status(200).send({ success: true, msg: 'Added new Employee.' ,employee });
		console.log(employee);
	});
});

app.delete('/employee/:id', ( req, res ) => {
	let _id = req.params.id;

	if ( !ObjectID.isValid(_id) ) {
		return res.status(404).send({ success: false, msg: 'Invalid ID.'});
	}

	Employee.findOneAndRemove({_id})
		.then(
			( employee ) => {
				if ( !employee ) {
					return res.status(404).send({ success: false, msg: 'Unable to find employee with the provided ID.'});
				}

				res.status(200).send({ success: true, msg: 'Removed Employee.' ,employee });
			},
			( err ) => {
				res.status(404).send({ success: false, msg: 'Unable to find employee with the provided ID.'});
			}
		)
		.catch(
			( err ) => {
				res.status(500).send({ success: false, msg: 'An Error has occured.' });
			}
		)

});

app.patch('/employee/:id', upload.single('profileImage'), ( req, res, next ) => {
	let _id = req.params.id;

	if ( !ObjectID.isValid(_id) ) {
		return res.status(404).send({ success: false, msg: 'Invalid ID.'});
	}

	let name 		 	= req.body.name;
	let position 	 	= req.body.position;
	let about 		 	= req.body.about;
	let linkedInAcc  	= req.body.linkedInAcc;
	let profileImage 	= req.file ? req.file.filename : 'noImage.jpg';


	req.checkBody('name', 'name field is required.').trim().notEmpty();
	req.checkBody('position', 'position field is required').trim().notEmpty();
	req.checkBody('about', 'about field is required').trim().notEmpty();

	let errors = req.validationErrors();

	if ( errors ) {
		return res.status(400).send({ errors });
	}


	Employee.findOne({_id})
		.then(
			( employee ) => {
				if ( !employee ) {
					return res.status(404).send({ success: false, msg: 'Unable to find employee with the provided ID.'});
				}

				employee.name 		= name;
				employee.position 	= position;
				employee.about 		= about;
				employee.linkedInAcc = req.body.linkedInAcc;
				/* figure the updated image here */
				if(employee.profileImage !== profileImage && profileImage !== 'noImage.jpg') {
					employee.profileImage = profileImage;
				}

				employee.save(( err, updatedEmployee ) => {
					if ( err ) {
						console.log(err);
						return res.status(500).send({ success: false, msg: 'An Error has occured.' });
					}
					res.status(200).send({ success: true, msg: 'Updated Employee Information.', employee });
				})
			},
			( err ) => {
				res.status(404).send({ success: false, msg: 'Unable to find employee with the provided ID.'});
			}
		)
		.catch(
			( err ) => {
				res.status(500).send({ success: false, msg: 'An Error has occured.' });
			}
		)
})

app.listen(port, () => {
	console.log('Server is runung on port ' + port);
})
