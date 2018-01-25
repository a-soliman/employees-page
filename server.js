const express			= require('express');
const bodyParser		= require('body-parser');
const expressValidator	= require('express-validator');
const multer			= require('multer');
const upload			= multer({dist: './uploads'});
const mongo 			= require('mongodb');
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
				res.status(500).send({ success: false, msg: 'An Error has occured.' })
			}
		)
});

app.post('/employee/add', ( req, res ) => {
	let name 		= req.body.name.trim();
	let position 	= req.body.position.trim();
	let about		= req.body.about.trim();
	let linkedInAcc	= req.body.linkedInAcc.trim();

	// validation
	req.checkBody('name', 'name field is required.').trim().notEmpty();
	req.checkBody('position', 'position field is required').trim().notEmpty();
	req.checkBody('about', 'about field is required').trim().notEmpty();
	req.checkBody('linkedInAcc', 'linkedIn Account field is required').trim().notEmpty();

	let errors = req.validationErrors();

	if ( errors ) {
		return res.status(400).send({ errors });
	}

	const newEmployee = new Employee({ name, position, about, linkedInAcc });

	newEmployee.save().then((employee) => {
		res.status(200).send({ success: true, employee });
		console.log(employee);
	});
})

app.listen(port, () => {
	console.log('Server is runung on port ' + port);
})