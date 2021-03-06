const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const StudentSchema = new mongoose.Schema({
	first_name: { type: String, required: true, trim: true, minLength: 1 },
	last_name: { type: String, required: true, trim: true, minLength: 1, default: null },
	email: { type: String, required: true, minLength: 1, unique: true, trim: true },
	dob: { type: String, required: true, minLength: 1, trim: true },
	password: { type: String, required: true, minLength: 1, trim: true },
	gender: { type: String, required: true, minLength: 1, trim: true },
	phone: { type: Number, required: true, trim: true, minLength: 1, },
	
	tenthMarks: { type: Number, required: true, default: 0, trim: true, minLength: 1 },
	btechMarks: { type: Number, required: true, default: 0, trim: true, minLength: 1 },
	twelvthMarks: { type: Number, required: true, default: 0, trim: true, minLength: 1 },
	type: { type: String, required: true, enum: ['Student'], trim: true, minLength: 1 },
	course: { type: String, required: true, trim: true, default: null, minLength: 1 },
	collegeID: { type: String, required: true, trim: true, default: null, minLength: 1 },
	startyear: { type: String, required: true, trim: true, default: null, minLength: 1 },
	endyear: { type: String, required: true, trim: true, default: null, minLength: 1 },
	
	training_company: { type: String, required: true, trim: true, default: null, minLength: 1 },
	training_location: { type: String, required: true, trim: true, default: null, minLength: 1 },
	training_duration: { type: Number, required: true, },
	native_place: { type: String, required: true, trim: true, default: null, minLength: 1 }
});

StudentSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};


StudentSchema.statics.checkValidPasswords = function (password, hashPassword) {

	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hashPassword, (err, res) => {
			if (res) {
				resolve();
			}
			else {
				reject();
			}
		});
	});
};


StudentSchema.pre('save', function (next) {
	var student = this;
	if (student.isModified('password')) {
		bcrypt.genSalt(5, (err, salt) => {
			bcrypt.hash(student.password, salt, (err, hash) => {
				student.password = hash;
				next();
			});
		});
	}
	else {
		next();
	}
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = { Student };