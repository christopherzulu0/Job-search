const mongoose = require('mongoose');
const shortid = require('shortid');


const UserSchema = mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  DOB: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  phoneNumber: {
    type:Number,
    required: true
  },
  Role:{
    type:String,
      enum: ['Job Seeker', 'Admin', 'Employeer'],
        default: 'Job Seeker'
  }
  
});

const JobsSchema = mongoose.Schema({
  JobCategories: {
    type: String,
    required: true
  },
  Jobs:[{
    Position:{
      type: String,
      required:true,
    },
    Location:{
      type: String,
      required: true,
    },
    CompanyName:{
      type: String,
      required: true,
    },
    DeadLine:{
      type: String,
      required: true,
    },
    JobSummary:{
      type: String,
      required: true,
    },
    Email:{
      type: String,
      required: true,
    },
    Requirements:{
      type: String,
      required: true,
    }
  }]
  
});

const SavedJobsSchema = mongoose.Schema({
    Position:{
      type: String,
      required:true,
    },
    Location:{
      type: String,
      required: true,
    },
    CompanyName:{
      type: String,
      required: true,
    },
    DeadLine:{
      type: String,
      required: true,
    },
    JobSummary:{
      type: String,
      required: true,
    },
    ClientNumber:{
      type: String,
      required: true,
    },
    PostedDate:{
      type: String,
      required: true,
    },
    Requirements:{
      type: String,
      required: true,
    }
 
});

const CompanyProfileSchema = mongoose.Schema({
    CompanyName: {
      type: String,
      required: true,
    },
    CompanyEmail: {
      type: String,
      required: true
    },
    CompanyAddress: {
      type: String,
      required: true
    },
    Companytype: {
      type: String,
      required: true
    },
    EmployeerNumber: {
      type: String,
      required: true
    },
})





const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobsSchema);
const Saved = mongoose.model('Saved',JobsSchema);
const Profile = mongoose.model('Profile', CompanyProfileSchema)


module.exports = {
  User,
  Job,
  Saved,
  Profile,
};