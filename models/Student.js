const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    regNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    supervisor: { type: String, required: true },
    status: { type: String, default: 'Registered' }, // Registered, Coursework, Thesis submitted, etc.
    email: { type: String },
    phone: { type: String },

    // Research Details
    researchTopic: { type: String },
    doctoralCommittee: [{ type: String }], // Array of staff names

    // Progress Tracking
    timeline: [
        {
            stage: String, // e.g., 'Coursework', 'Comprehensive Viva'
            status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
            dateCompleted: Date
        }
    ],

    // Files & Documents (Updated to match Dashboard)
    provisionFiles: [
        {
            name: String,
            size: Number,
            type: String,
            url: String
        }
    ],
    degreeFiles: [
        {
            name: String,
            size: Number,
            type: String,
            url: String
        }
    ],
    synopsisFiles: [
        {
            name: String,
            size: Number,
            type: String, // PDF
            url: String
        }
    ],

    // Literature Review
    literaturePapers: [
        {
            title: String,
            journal: String,
            publisher: String,
            year: String,
            doi: String
        }
    ],

    // Additional Fields from Dashboard
    university: String,
    usertype: String,
    year: Number,
    topic: String

}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
