const express			= require('express');
const bodyParser		= require('body-parser');
const expressValidator	= require('express-validator');
const multer			= require('multer');
const upload			= multer({dist: './uploads'});
const mongo 			= require('mongodb');
const mongoose 			= require('mongoose');

const {Employee} 		= require('./models/employee');



app.listen(port, () => {
	console.log('Server is runung on port ' + port);
})